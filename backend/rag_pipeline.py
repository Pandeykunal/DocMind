import json
import os
import shutil
import pytesseract
from typing import List, Optional
from dotenv import load_dotenv

from unstructured.partition.pdf import partition_pdf
from unstructured.chunking.title import chunk_by_title
from langchain_core.documents import Document
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma

load_dotenv()

# ── Tesseract setup (Windows only) ───────────────────────────────
if os.name == "nt":
    os.environ["PATH"] += os.pathsep + r"C:\Program Files\Tesseract-OCR"
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ── RTL & language code maps ─────────────────────────────────────
RTL_LANGUAGES = {"Arabic", "Urdu", "Hebrew", "Persian", "Pashto", "Sindhi"}

LANG_CODE_MAP = {
    "Afrikaans": "af", "Albanian": "sq", "Amharic": "am", "Arabic": "ar",
    "Armenian": "hy", "Azerbaijani": "az", "Basque": "eu", "Belarusian": "be",
    "Bengali": "bn", "Bosnian": "bs", "Bulgarian": "bg", "Catalan": "ca",
    "Chinese": "zh", "Croatian": "hr", "Czech": "cs", "Danish": "da",
    "Dutch": "nl", "English": "en", "Estonian": "et", "Finnish": "fi",
    "French": "fr", "Galician": "gl", "Georgian": "ka", "German": "de",
    "Greek": "el", "Gujarati": "gu", "Haitian Creole": "ht", "Hebrew": "he",
    "Hindi": "hi", "Hungarian": "hu", "Icelandic": "is", "Indonesian": "id",
    "Irish": "ga", "Italian": "it", "Japanese": "ja", "Kannada": "kn",
    "Kazakh": "kk", "Korean": "ko", "Latvian": "lv", "Lithuanian": "lt",
    "Macedonian": "mk", "Malay": "ms", "Malayalam": "ml", "Maltese": "mt",
    "Marathi": "mr", "Nepali": "ne", "Norwegian": "no", "Pashto": "ps",
    "Persian": "fa", "Polish": "pl", "Portuguese": "pt", "Punjabi": "pa",
    "Romanian": "ro", "Russian": "ru", "Serbian": "sr", "Sindhi": "sd",
    "Sinhala": "si", "Slovak": "sk", "Slovenian": "sl", "Somali": "so",
    "Spanish": "es", "Swahili": "sw", "Swedish": "sv", "Tagalog": "tl",
    "Tajik": "tg", "Tamil": "ta", "Telugu": "te", "Thai": "th",
    "Turkish": "tr", "Ukrainian": "uk", "Urdu": "ur", "Uzbek": "uz",
    "Vietnamese": "vi", "Welsh": "cy", "Xhosa": "xh", "Yoruba": "yo",
    "Zulu": "zu",
}


# ════════════════════════════════════════════════════════════════
#  Language Utilities
# ════════════════════════════════════════════════════════════════

class LanguageUtils:
    def __init__(self, llm):
        self.llm = llm

    def detect(self, text: str) -> str:
        prompt = (
            "Detect the language of the text below. "
            "Reply with ONLY the language name in English (e.g. Hindi, French, Arabic). "
            "Nothing else.\n\n"
            f"Text: {text[:400]}\n\nLanguage:"
        )
        try:
            result = self.llm.invoke(prompt).content.strip()
            return result.split("\n")[0].split(".")[0].strip()
        except Exception as e:
            print(f"Language detection failed: {e}")
            return "English"

    def translate_to_english(self, text: str, source_lang: str) -> str:
        if source_lang.lower() == "english":
            return text
        prompt = (
            f"Translate the following {source_lang} text to English. "
            "Return ONLY the translated text, nothing else.\n\n"
            f"{text}"
        )
        try:
            return self.llm.invoke(prompt).content.strip()
        except Exception as e:
            print(f"Translation to English failed: {e}")
            return text

    def translate_from_english(self, text: str, target_lang: str) -> str:
        if target_lang.lower() == "english":
            return text
        prompt = (
            f"Translate the following English text to {target_lang}. "
            "Return ONLY the translated text, nothing else.\n\n"
            f"{text}"
        )
        try:
            return self.llm.invoke(prompt).content.strip()
        except Exception as e:
            print(f"Translation from English failed: {e}")
            return text

    def get_lang_code(self, language: str) -> str:
        return LANG_CODE_MAP.get(language, "en")

    def is_rtl(self, language: str) -> bool:
        return language in RTL_LANGUAGES


# ════════════════════════════════════════════════════════════════
#  RAG Pipeline
# ════════════════════════════════════════════════════════════════

class RAGPipeline:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0,
            api_key=os.getenv("GROQ_API_KEY")
        )
        self.embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
        self.lang_utils = LanguageUtils(self.llm)
        self.db: Optional[Chroma] = None
        self.doc_language: str = "English"
        self.pdf_loaded: bool = False

    # ── STEP 1: Partition PDF ─────────────────────────────────────

    def _partition(self, file_path: str):
        print(f"Partitioning: {file_path}")
        elements = partition_pdf(
            filename=file_path,
            strategy="hi_res",
            infer_table_structure=True,
            extract_image_block_types=["Image"],
            extract_image_block_to_payload=True
        )
        print(f"Extracted {len(elements)} elements")
        return elements

    # ── STEP 2: Chunk by Title ────────────────────────────────────

    def _chunk(self, elements):
        print("Creating smart chunks...")
        chunks = chunk_by_title(
            elements,
            max_characters=3000,
            new_after_n_chars=2400,
            combine_text_under_n_chars=500
        )
        print(f"Created {len(chunks)} chunks")
        return chunks

    # ── STEP 3: Separate Content Types ───────────────────────────

    def _separate_content(self, chunk) -> dict:
        content = {
            "text": chunk.text,
            "tables": [],
            "images": [],
            "types": ["text"]
        }
        if hasattr(chunk, "metadata") and hasattr(chunk.metadata, "orig_elements"):
            for el in chunk.metadata.orig_elements:
                el_type = type(el).__name__
                if el_type == "Table":
                    content["types"].append("table")
                    content["tables"].append(
                        getattr(el.metadata, "text_as_html", el.text)
                    )
                elif el_type == "Image":
                    if hasattr(el, "metadata") and hasattr(el.metadata, "image_base64"):
                        content["types"].append("image")
                        content["images"].append(el.metadata.image_base64)
        content["types"] = list(set(content["types"]))
        return content

    # ── STEP 4: AI Summary ────────────────────────────────────────

    def _ai_summary(self, text: str, tables: List[str], images: List[str], doc_lang: str = "English") -> str:
        prompt = f"""You are creating a searchable English description for multilingual document retrieval.
The source document is in {doc_lang}. Generate the summary in ENGLISH regardless of source language,
so it can be retrieved by queries in any language.

TEXT CONTENT:
{text}
"""
        if tables:
            prompt += "\nTABLES (HTML format):\n"
            for i, table in enumerate(tables):
                prompt += f"Table {i+1}:\n{table}\n\n"
        if images:
            prompt += f"\n[Note: This chunk contains {len(images)} image(s)]\n"

        prompt += """
YOUR TASK:
Generate a comprehensive, searchable English description covering:
1. Key facts, numbers, and data points from text and tables
2. Main topics and concepts discussed
3. Questions this content could answer
4. Alternative search terms users might use

SEARCHABLE DESCRIPTION (in English):"""

        try:
            return self.llm.invoke(prompt).content
        except Exception as e:
            print(f"AI summary failed: {e}")
            summary = f"{text[:300]}..."
            if tables:
                summary += f" [Contains {len(tables)} table(s)]"
            if images:
                summary += f" [Contains {len(images)} image(s)]"
            return summary

    # ── STEP 5: Process All Chunks ────────────────────────────────

    def _process_chunks(self, chunks) -> List[Document]:
        print("Processing chunks with AI summaries...")
        documents = []
        total = len(chunks)
        seen_contents = set()

        for i, chunk in enumerate(chunks):
            print(f"  Processing chunk {i+1}/{total}")
            content = self._separate_content(chunk)

            if content["text"] in seen_contents:
                print(f"  Skipping duplicate chunk {i+1}")
                continue
            seen_contents.add(content["text"])

            if content["tables"] or content["images"]:
                page_content = self._ai_summary(
                    content["text"],
                    content["tables"],
                    content["images"],
                    doc_lang=self.doc_language
                )
                print(f"  AI summary created for chunk {i+1}")
            else:
                if self.doc_language.lower() != "english":
                    page_content = self.lang_utils.translate_to_english(
                        content["text"], self.doc_language
                    )
                else:
                    page_content = content["text"]

            documents.append(Document(
                page_content=page_content,
                metadata={
                    "original_content": json.dumps({
                        "raw_text": content["text"],
                        "tables_html": content["tables"],
                        "images_base64": content["images"]
                    }),
                    "doc_language": self.doc_language
                }
            ))

        print(f"Processed {len(documents)} chunks")
        return documents

    # ── STEP 6: Store in ChromaDB ─────────────────────────────────

    def _store(self, documents: List[Document]):
        print("Creating embeddings and storing in ChromaDB...")
        self.db = Chroma.from_documents(
            documents=documents,
            embedding=self.embedding_model,
            persist_directory="./chroma_db",
            collection_metadata={"hnsw:space": "cosine"}
        )
        print(f"Stored {self.db._collection.count()} vectors")

    # ── MAIN: Process PDF ─────────────────────────────────────────

    def process_pdf(self, file_path: str) -> int:
        # ← Clear old ChromaDB so every new PDF gets fresh vectors
        if os.path.exists("./chroma_db"):
            shutil.rmtree("./chroma_db")
            print("Cleared old ChromaDB.")

        elements = self._partition(file_path)

        # Detect document language
        sample_text = " ".join([
            el.text for el in elements[:5]
            if hasattr(el, "text") and el.text.strip()
        ])
        if sample_text:
            self.doc_language = self.lang_utils.detect(sample_text)
            print(f"Detected document language: {self.doc_language}")
        else:
            self.doc_language = "English"

        chunks = self._chunk(elements)
        documents = self._process_chunks(chunks)
        self._store(documents)
        self.pdf_loaded = True
        return len(documents)

    # ── MAIN: Query ───────────────────────────────────────────────

    def query(self, question: str) -> dict:
        if not self.db:
            raise ValueError("No PDF loaded. Please upload a PDF first.")

        query_lang = self.lang_utils.detect(question)
        print(f"Query language: {query_lang}")

        english_question = self.lang_utils.translate_to_english(question, query_lang)
        print(f"English query: {english_question}")

        retriever = self.db.as_retriever(search_kwargs={"k": 3})
        retrieved_chunks = retriever.invoke(english_question)

        prompt = f"""Answer the following question based only on the documents provided below.
IMPORTANT: You MUST respond in {query_lang}. Do not use English unless the question was in English.

Question: {question}
(English translation for context: {english_question})

"""
        all_tables, all_images = [], []
        seen_texts = set()

        for i, chunk in enumerate(retrieved_chunks):
            if "original_content" in chunk.metadata:
                data = json.loads(chunk.metadata["original_content"])

                raw_text = data.get("raw_text", "")
                if raw_text and raw_text not in seen_texts:
                    seen_texts.add(raw_text)
                    prompt += f"--- Document {i+1} ---\n"
                    prompt += f"TEXT:\n{raw_text}\n\n"

                tables = data.get("tables_html", [])
                if tables:
                    all_tables.extend(tables)
                    for j, t in enumerate(tables):
                        prompt += f"Table {j+1}:\n{t}\n\n"

                all_images.extend(data.get("images_base64", []))

        prompt += (
            f'\nIf the documents do not contain enough information, '
            f'say so in {query_lang}.\n\n'
            f'ANSWER (respond in {query_lang}):'
        )

        response = self.llm.invoke(prompt)

        return {
            "answer": response.content,
            "query_language": query_lang,
            "query_language_code": self.lang_utils.get_lang_code(query_lang),
            "query_is_rtl": self.lang_utils.is_rtl(query_lang),
            "doc_language": self.doc_language,
            "tables": all_tables,
            "images": all_images
        }
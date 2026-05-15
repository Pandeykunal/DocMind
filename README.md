#  DocMind — Multilingual RAG-Powered PDF Chat

DocMind is a full-stack AI application that allows users to have intelligent conversations with any PDF document. Unlike traditional keyword search, DocMind uses Retrieval-Augmented Generation (RAG) to semantically understand your document and provide accurate, context-aware answers.
What makes DocMind unique is its multimodal and multilingual capabilities. It doesn't just read text — it extracts tables and images from PDFs and includes them in its responses. It also detects the language of your question and responds in the same language, supporting 50+ languages including Arabic, Hindi, and Hebrew with full RTL text support.
Under the hood, DocMind parses PDFs using high-resolution OCR, chunks them intelligently based on document structure, generates multilingual embeddings, and stores them in a vector database. When a user asks a question, the most relevant chunks are retrieved and passed to Groq's LLaMA 3.3-70B to generate a precise answer — all in under a few seconds.

---

##  Features

| Feature | Description |
|---|---|
|  **PDF Chat** | Upload any PDF and ask questions naturally |
|  **50+ Languages** | Ask in any language, get answers in the same language |
|  **Image Extraction** | Extracts and displays images from PDFs |
|  **Table Extraction** | Understands tables for better contextual answers |
|  **Semantic Search** | Vector embeddings find the most relevant content |
|  **RTL Support** | Full support for Arabic, Urdu, Hebrew |
|  **OCR Support** | Handles scanned and image-based PDFs via Tesseract |
|  **Fast Responses** | Powered by Groq LLaMA 3.3-70B inference |

---

##  Demo

 **[Watch Demo Video & Screenshots](https://drive.google.com/drive/folders/1OcioTDdv4k_wIH6Ep9LGoJ7tgc-ANAgM?usp=sharing)**

---

##  How It Works

```
User uploads PDF
      ↓
Unstructured + Tesseract OCR
extracts text, tables, images
      ↓
HuggingFace Multilingual MiniLM
converts chunks → vector embeddings
      ↓
ChromaDB stores embeddings
      ↓
User asks a question (any language)
      ↓
Semantic search retrieves
most relevant chunks
      ↓
Groq LLaMA 3.3-70B generates
answer in the same language
      ↓
React displays response
```

---

##  Tech Stack

### Frontend
- **React** + **Vite** — UI framework and build tool
- **Tailwind CSS** — Styling

### Backend
- **FastAPI** — REST API framework
- **LangChain** — RAG pipeline orchestration
- **ChromaDB** — Vector database for embeddings

### AI / ML
- **Groq LLaMA 3.3-70B** — LLM for answer generation
- **HuggingFace Multilingual MiniLM** — Multilingual embeddings

### PDF Processing
- **Unstructured** — Text, table, image extraction
- **Tesseract OCR** — Scanned PDF support

---

##  API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server status check |
| POST | `/upload` | Upload and process PDF |
| POST | `/query` | Ask questions from uploaded PDF |

Full API docs: `http://localhost:8000/docs`

---

##  Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- Tesseract OCR installed
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### Backend Setup

```bash
git clone <your-repo-link>
cd DocMind/backend

python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

Create `.env` inside `backend/`:
```env
GROQ_API_KEY=your_api_key_here
```

Run backend:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

##  Future Improvements

- [ ] Conversation memory across sessions
- [ ] Citation-based answers with page references
- [ ] Multi-document chat
- [ ] Voice input / output
- [ ] Cloud deployment
- [ ] Authentication system

---

</div>




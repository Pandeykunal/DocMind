Here's a impressive README for DocMind:

````markdown
# DocMind 🧠
### Chat with your PDF — text, tables & images in any language

![DocMind UI](./assets/demo.png)

> **DocMind** is a production-grade Multimodal RAG (Retrieval-Augmented Generation) application that lets you upload any PDF and ask questions about it in **50+ languages**. It extracts and understands text, tables, and images from your document using state-of-the-art AI models.

---

## 🎥 Demo



https://github.com/Pandeykunal/DocMind/assets/demo.mp4



---

## ✨ Features

- 📄 **PDF Upload** — drag & drop any PDF document
- 💬 **Multilingual Chat** — ask questions in English, Hindi, Arabic, French and 50+ more languages
- 📊 **Table Extraction** — automatically extracts and renders tables from PDFs
- 🖼️ **Image Retrieval** — finds and displays relevant images from your PDF
- 🌐 **RTL Support** — right-to-left language support (Arabic, Urdu, Hebrew)
- ⚡ **Fast Responses** — powered by Groq's LLaMA 3.3-70B
- 🔍 **Smart Chunking** — document-structure-aware chunking for better retrieval

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| **FastAPI** | REST API server |
| **LangChain** | RAG pipeline orchestration |
| **Groq LLaMA 3.3-70B** | LLM for answers & summarization |
| **ChromaDB** | Vector database for semantic search |
| **Unstructured** | PDF parsing (text, tables, images) |
| **HuggingFace MiniLM** | Multilingual embeddings |
| **Pytesseract** | OCR for scanned PDFs |

### Frontend
| Tool | Purpose |
|---|---|
| **React + Vite** | Frontend framework |
| **Tailwind CSS** | Styling |
| **Axios** | API communication |

---

## 🏗️ Architecture

```
PDF Upload
    ↓
Unstructured (hi_res OCR)
    ↓
Smart Chunking (chunk_by_title)
    ↓
AI Summarization (Groq LLaMA)     ← for chunks with tables/images
    ↓
Multilingual Embeddings (MiniLM-L12)
    ↓
ChromaDB Vector Store
    ↓
Query → Language Detection → Translate to English
    ↓
Semantic Retrieval (top-3 chunks)
    ↓
LLM Answer Generation (in query language)
    ↓
Response with text + tables + images
```

---

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Groq API Key](https://console.groq.com)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_key_here > .env

uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
DocMind/
├── backend/
│   ├── main.py              ← FastAPI routes
│   ├── rag_pipeline.py      ← Full RAG pipeline
│   ├── models.py            ← Pydantic models
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFUpload.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── TableRenderer.jsx
│   │   │   └── ImageViewer.jsx
│   │   ├── api/
│   │   │   └── client.js
│   │   └── App.jsx
│   └── package.json
```

---

## 🌍 Multilingual Support

DocMind detects the language of your question and responds in the same language:

| Query Language | Response Language |
|---|---|
| English | English |
| Hindi (हिंदी) | Hindi |
| Arabic (العربية) | Arabic (RTL) |
| French | French |
| Spanish | Spanish |
| + 45 more | Matching language |

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Check server status |
| `POST` | `/upload` | Upload and process PDF |
| `POST` | `/query` | Ask a question |

Full API docs available at `/docs` (Swagger UI)

---

## 👨‍💻 Author

**Kunal Pandey**
- GitHub: [@Pandeykunal](https://github.com/Pandeykunal)

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.
````

---



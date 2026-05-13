# DocMind 🧠

A RAG-based web app that lets you chat with any PDF — extracts text, tables, and images, and answers questions in 50+ languages.

## Tech Stack

- **Frontend** — React, Vite, Tailwind CSS
- **Backend** — FastAPI, LangChain, ChromaDB
- **LLM** — Groq LLaMA 3.3-70B
- **PDF Parsing** — Unstructured (OCR via Tesseract)
- **Embeddings** — HuggingFace Multilingual MiniLM

## Features

- Upload any PDF via drag & drop
- Ask questions in any language — responds in the same language
- Extracts and displays tables and images from the PDF
- RTL language support (Arabic, Urdu, Hebrew)

## Run Locally

**Backend**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
# add GROQ_API_KEY to .env
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server status |
| POST | `/upload` | Upload and process PDF |
| POST | `/query` | Ask a question |

API docs at `http://localhost:8000/docs`




MIT License — feel free to use this project for learning and portfolio purposes.
````

---



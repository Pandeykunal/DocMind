# DocMind

A powerful **Multilingual RAG (Retrieval-Augmented Generation)** web application that lets users chat with any PDF intelligently.
DocMind extracts **text, tables, and images** from documents and answers questions in **50+ languages** using advanced LLMs and multilingual embeddings.

---

## 🚀 Features

* 📄 Upload any PDF using drag & drop
* 🌍 Ask questions in **50+ languages**
* 🔁 Responses generated in the **same language** as the query
* 🖼️ Extracts and displays **images** from PDFs
* 📊 Extracts **tables** for better contextual understanding
* 🧠 Semantic search using vector embeddings
* 🌐 RTL language support (**Arabic, Urdu, Hebrew**)
* ⚡ Fast and accurate responses powered by **Groq LLaMA 3.3-70B**
* 🔍 OCR support for scanned PDFs using **Tesseract**

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* FastAPI
* LangChain
* ChromaDB

### AI / ML

* Groq LLaMA 3.3-70B
* HuggingFace Multilingual MiniLM Embeddings

### PDF Processing

* Unstructured
* Tesseract OCR

---

## 📸 Demo & Screenshots

* [View Demo Video & Screenshots](https://drive.google.com/drive/folders/1OcioTDdv4k_wIH6Ep9LGoJ7tgc-ANAgM?usp=sharing)

---

## ⚙️ Run Locally

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd DocMind
```

---

## 🔧 Backend Setup

```bash
cd backend

python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_api_key_here
```

Run the backend server:

```bash
uvicorn main:app --reload --port 8000
```

---

## 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint  | Description                     |
| ------ | --------- | ------------------------------- |
| GET    | `/health` | Server status                   |
| POST   | `/upload` | Upload and process PDF          |
| POST   | `/query`  | Ask questions from uploaded PDF |

API Documentation:

```bash
http://localhost:8000/docs
```

---

## 🧠 How It Works

1. User uploads a PDF
2. PDF is parsed using Unstructured + OCR
3. Text chunks are embedded using HuggingFace embeddings
4. Embeddings are stored in ChromaDB
5. Relevant chunks are retrieved for user queries
6. Groq LLaMA generates contextual multilingual answers

---

## 📌 Future Improvements

* Conversation memory
* Citation-based answers
* Multi-document chat
* Voice input/output
* Cloud deployment
* Authentication system

---





import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import QueryRequest, QueryResponse, UploadResponse, HealthResponse
from rag_pipeline import RAGPipeline

load_dotenv()

app = FastAPI(
    title="Multimodal RAG API",
    description="Upload PDFs and query them with text, table and image retrieval",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", os.getenv("FRONTEND_URL", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Single pipeline instance shared across all requests
pipeline = RAGPipeline()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/health", response_model=HealthResponse)
async def health():
    return {
        "status": "ok",
        "pdf_loaded": pipeline.pdf_loaded
    }


@app.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        count = pipeline.process_pdf(file_path)
        pipeline.pdf_loaded = True        # ← ensures pdf_loaded is True after caching too
        return {
            "message": "PDF processed successfully",
            "filename": file.filename,
            "chunks_count": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    if not pipeline.pdf_loaded:
        raise HTTPException(
            status_code=400,
            detail="No PDF uploaded yet. Please upload a PDF first."
        )
    try:
        result = pipeline.query(request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
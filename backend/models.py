from pydantic import BaseModel
from typing import List

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    tables: List[str] = []
    images: List[str] = []
    query_language: str = "English"
    query_language_code: str = "en"
    query_is_rtl: bool = False
    doc_language: str = "English"

class UploadResponse(BaseModel):
    message: str
    filename: str
    chunks_count: int

class HealthResponse(BaseModel):
    status: str
    pdf_loaded: bool
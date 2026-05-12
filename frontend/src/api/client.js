import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const checkHealth = () => API.get("/health");

export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const queryRAG = (question) =>
  API.post("/query", { question });
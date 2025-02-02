import os
import chromadb
from fastapi import FastAPI, Query
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

# Step 2: Define Paths
CHROMA_DB_PATH = "chroma_db"

# Step 3: Initialize FastAPI
app = FastAPI(title="TfL RAG System", version="1.0")

# Step 4: Load ChromaDB and Embedding Model
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = chroma_client.get_or_create_collection(name="tfl_data")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Step 5: Define Request Model
class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

# Step 6: API Endpoint for Querying TfL Data
@app.post("/query")
def query_tfl_data(request: QueryRequest):
    query_embedding = model.encode(request.question).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=request.top_k
    )

    return {
        "query": request.question,
        "top_results": results["documents"][0]
    }

# Step 7: Run the FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

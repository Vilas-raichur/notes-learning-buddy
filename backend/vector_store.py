import chromadb

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}
)

def add_chunks_to_store(document_id: int, chunks: list[str], embeddings):
    ids = [f"doc{document_id}_chunk{i}" for i in range(len(chunks))]
    metadatas = [{"document_id": document_id, "chunk_index": i} for i in range(len(chunks))]
    collection.add(
        ids=ids,
        embeddings=embeddings.tolist(),
        documents=chunks,
        metadatas=metadatas
    )

def query_store(query_embedding, n_results=3):
    return collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=n_results
    )
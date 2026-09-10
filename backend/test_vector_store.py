from chunking import chunk_text
from embeddings import generate_embeddings
from vector_store import add_chunks_to_store, query_store
import sqlite3

conn = sqlite3.connect('studybuddy.db')
row = conn.execute('SELECT content_text FROM documents WHERE id=1;').fetchone()
text = row[0]

chunks = chunk_text(text)
vectors = generate_embeddings(chunks)

add_chunks_to_store(document_id=1, chunks=chunks, embeddings=vectors)
print("Chunks added to vector store.")

query = "What is the churn threshold used in this study?"
query_vector = generate_embeddings([query])[0]

results = query_store(query_vector, n_results=2)
print("\nTop matching chunks:")
for doc in results['documents'][0]:
    print("---")
    print(doc)
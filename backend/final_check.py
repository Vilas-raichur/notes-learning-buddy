import sqlite3
from embeddings import generate_embeddings
from vector_store import collection, query_store

conn = sqlite3.connect('studybuddy.db')
docs = conn.execute("SELECT id, filename FROM documents;").fetchall()

print("=== Chunk counts per document ===")
doc_ids = []
for doc_id, filename in docs:
    result = collection.get(where={"document_id": doc_id})
    print(f"{filename} (id={doc_id}): {len(result['ids'])} chunks")
    doc_ids.append(doc_id)

print("\n=== Top 3 retrieved chunks for 'tech stack used' ===")
query_vector = generate_embeddings(["tech stack used"])[0]
results = query_store(query_vector, n_results=3, document_ids=doc_ids)

for i, (chunk, meta) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
    print(f"--- chunk {i+1} (document_id={meta['document_id']}) ---")
    print(chunk[:200])
    print()
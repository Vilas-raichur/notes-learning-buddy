import sqlite3
from embeddings import generate_embeddings
from vector_store import query_store

conn = sqlite3.connect('studybuddy.db')
row = conn.execute("SELECT id, filename FROM documents WHERE filename LIKE 'paper1%' ORDER BY id DESC LIMIT 1;").fetchone()
doc_id = row[0]
print(f"Using document: {row[1]} (id={doc_id})")

question = "paper1 resembles which exam pattern"
query_vector = generate_embeddings([question])[0]
results = query_store(query_vector, n_results=3, document_ids=[doc_id])

for i, chunk in enumerate(results['documents'][0]):
    print(f"--- chunk {i+1} ---")
    print(chunk[:300])
    print()
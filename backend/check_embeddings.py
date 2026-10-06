import sqlite3
from vector_store import collection

conn = sqlite3.connect('studybuddy.db')
docs = conn.execute("SELECT id, filename FROM documents;").fetchall()

for doc_id, filename in docs:
    result = collection.get(where={"document_id": doc_id})
    print(f"{filename} (id={doc_id}): {len(result['ids'])} chunks in vector store")
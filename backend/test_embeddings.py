from chunking import chunk_text
from embeddings import generate_embeddings
import sqlite3

conn = sqlite3.connect('studybuddy.db')
row = conn.execute('SELECT content_text FROM documents WHERE id=1;').fetchone()
text = row[0]

chunks = chunk_text(text)
vectors = generate_embeddings(chunks)

print(f"Number of chunks: {len(chunks)}")
print(f"Embedding shape: {vectors.shape}")
print(f"First 5 values of the first embedding: {vectors[0][:5]}")
import sqlite3
from chunking import chunk_text

conn = sqlite3.connect('studybuddy.db')
row = conn.execute('SELECT content_text FROM documents WHERE id=1;').fetchone()
text = row[0]

chunks = chunk_text(text)
print(f"Number of chunks: {len(chunks)}")
print("---First chunk---")
print(chunks[0])
print("---Second chunk (should overlap slightly with the end of the first)---")
print(chunks[1][:100])
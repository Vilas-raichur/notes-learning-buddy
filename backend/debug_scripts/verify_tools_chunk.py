from embeddings import generate_embeddings
from vector_store import query_store

query_vector = generate_embeddings(["tech stack used"])[0]
results = query_store(query_vector, n_results=3, document_ids=[2])

for i, chunk in enumerate(results['documents'][0]):
    print(f"--- Synopsis chunk {i+1} ---")
    print(chunk[:250])
    print()
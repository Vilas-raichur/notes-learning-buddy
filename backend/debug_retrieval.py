from embeddings import generate_embeddings
from vector_store import query_store

question = "tell me or give atleast two references"
query_vector = generate_embeddings([question])[0]
results = query_store(query_vector, n_results=3, document_ids=[1])

for i, chunk in enumerate(results['documents'][0]):
    print(f"--- Retrieved chunk {i+1} ---")
    print(chunk)
    print()
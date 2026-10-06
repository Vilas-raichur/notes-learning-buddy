from embeddings import generate_embeddings
from vector_store import query_store

query_vector = generate_embeddings(["tech stack used"])[0]
results = query_store(query_vector, n_results=9, document_ids=[2])

for i, chunk in enumerate(results['documents'][0]):
    marker = " <-- TOOLS SECTION" if "Python" in chunk and "SQL" in chunk else ""
    print(f"Rank {i+1}{marker}")
    print(chunk[:150])
    print()
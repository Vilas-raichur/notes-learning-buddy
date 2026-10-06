from embeddings import generate_embeddings
from vector_store import collection

query_vector = generate_embeddings(["tech stack used"])[0]

for doc_id in [1, 2]:
    print(f"=== Document {doc_id} ===")
    results = collection.query(
        query_embeddings=[query_vector.tolist()],
        n_results=3,
        where={"document_id": doc_id}
    )
    for chunk, meta, distance in zip(results['documents'][0], results['metadatas'][0], results['distances'][0]):
        print(f"chunk_index={meta['chunk_index']}  distance={distance:.4f}")
    print()
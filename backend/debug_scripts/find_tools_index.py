from vector_store import collection

result = collection.get(where={"document_id": 2})
for id, doc, meta in zip(result['ids'], result['documents'], result['metadatas']):
    if "Python" in doc and "SQL" in doc:
        print(f"Tools chunk found: {id}, chunk_index={meta['chunk_index']}")
        print(doc)
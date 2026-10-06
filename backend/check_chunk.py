from vector_store import collection

result = collection.get(where={"document_id": 2})
for id, doc in zip(result['ids'], result['documents']):
    if 'chunk0' in id or id.endswith('_chunk0'):
        print(f"ID: {id}")
        print(doc)
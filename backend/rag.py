from embeddings import generate_embeddings
from vector_store import query_store
import ollama

def answer_question(question: str, document_ids: list[int] = None, n_results: int = 3) -> dict:
    query_vector = generate_embeddings([question])[0]
    results = query_store(query_vector, n_results=n_results, document_ids=document_ids)

    retrieved_chunks = results['documents'][0]
    metadatas = results['metadatas'][0]
    context = "\n\n".join(retrieved_chunks)

    prompt = f"""Answer the question using ONLY the context provided below. If the answer isn't in the context, say "I don't have enough information to answer that."

Context:
{context}

Question: {question}

Answer:"""

    response = ollama.chat(model='llama3.2', messages=[
        {'role': 'user', 'content': prompt}
    ])

    return {
        "answer": response['message']['content'],
        "sources": metadatas
    }
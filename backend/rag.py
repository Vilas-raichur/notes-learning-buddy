import time
from embeddings import generate_embeddings
from vector_store import query_store
import ollama

def answer_question(question: str, document_ids: list[int] = None, n_results: int = 3) -> dict:
    query_vector = generate_embeddings([question])[0]

    if document_ids and len(document_ids) > 1:
        per_doc_results = 3
        retrieved_chunks = []
        metadatas = []
        for doc_id in document_ids:
            results = query_store(query_vector, n_results=per_doc_results, document_ids=[doc_id])
            retrieved_chunks.extend(results['documents'][0])
            metadatas.extend(results['metadatas'][0])
    else:
        results = query_store(query_vector, n_results=n_results, document_ids=document_ids)
        retrieved_chunks = results['documents'][0]
        metadatas = results['metadatas'][0]

    context_parts = []
    for chunk, meta in zip(retrieved_chunks, metadatas):
        context_parts.append(f"[Excerpt from document {meta['document_id']}]\n{chunk}")
    context = "\n\n".join(context_parts)

    system_prompt = (
        "Answer the question using ONLY the information in the context below. "
        "The context contains excerpts from multiple different documents, and some excerpts "
        "may be completely unrelated to the question. Ignore any excerpt that does not help "
        "answer the question, and base your answer only on the excerpt(s) that actually do. "
        "If none of the excerpts contain the answer, respond with exactly: "
        "\"I don't have enough information to answer that.\" "
        "Never invent, continue, or complete numbered questions or multiple-choice options, "
        "even if the context contains them. Keep your answer under 3 sentences."
    )

    user_prompt = f"""Context:
{context}

Question: {question}"""

    response = ollama.chat(
        model='llama3.2',
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ],
        options={'num_predict': 300, 'temperature': 0.2},
        keep_alive="30m"
    )

    return {
        "answer": response['message']['content'],
        "sources": metadatas
    }
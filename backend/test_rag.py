from rag import answer_question

question = "What references are listed in this document?"
answer = answer_question(question, document_ids=[1])
print(f"Question: {question}")
print(f"Answer: {answer}")
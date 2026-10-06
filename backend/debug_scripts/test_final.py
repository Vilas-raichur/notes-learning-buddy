from rag import answer_question

question = "tech stack used"
result = answer_question(question, document_ids=[1, 2])

print("Answer:")
print(result["answer"])
print("\nSources:")
for s in result["sources"]:
    print(s)
import ollama

context = """6. TOOLS AND TECHNOLOGIES USED Programming Language: Python (Pandas, NumPy) Database and Query Language: SQL (SQLite) Development Environment: Jupyter Notebook Visualization Tool: Microsoft Power BI Version Control and Hosting: Git and GitHub"""

system_prompt = (
    "You are a study assistant. Answer the question using ONLY the context below. "
    "If the answer isn't in the context, say \"I don't have enough information to answer that.\""
)

user_prompt = f"Context:\n{context}\n\nQuestion: tech stack used"

response = ollama.chat(
    model='llama3.2',
    messages=[
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': user_prompt}
    ],
    options={'num_predict': 300, 'temperature': 0.2}
)

print(response['message']['content'])
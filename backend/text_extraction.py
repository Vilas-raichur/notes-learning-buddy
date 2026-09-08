import docx
from pypdf import PdfReader

def extract_text_from_docx(file_path: str) -> str:
    doc = docx.Document(file_path)
    full_text = [paragraph.text for paragraph in doc.paragraphs]
    return "\n".join(full_text)

def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    full_text = []
    for page in reader.pages:
        full_text.append(page.extract_text())
    return "\n".join(full_text)

def extract_text(file_path: str) -> str:
    if file_path.lower().endswith(".docx"):
        return extract_text_from_docx(file_path)
    elif file_path.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_path}")
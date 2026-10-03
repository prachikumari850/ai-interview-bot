import pymupdf


def extract_text(pdf_bytes: bytes) -> str:
    with pymupdf.open(stream=pdf_bytes, filetype="pdf") as document:
        return "\n".join(page.get_text() for page in document).strip()
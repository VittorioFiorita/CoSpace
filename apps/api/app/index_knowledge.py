from pathlib import Path

from sentence_transformers import SentenceTransformer
from sqlmodel import Session, delete

from .database import engine
from .models import KnowledgeChunk

MODEL_NAME = "all-MiniLM-L6-v2"
DOC_PATH = Path(__file__).resolve().parent.parent / "knowledge" / "coworking_policy.md"


def chunk_document(text: str) -> list[str]:
    sections = text.split("\n## ")
    chunks = []
    for i, section in enumerate(sections):
        section = section if i == 0 else "## " + section
        section = section.strip()
        if section:
            chunks.append(section)
    return chunks


def main():
    text = DOC_PATH.read_text(encoding="utf-8")
    chunks = chunk_document(text)

    model = SentenceTransformer(MODEL_NAME)
    embeddings = model.encode(chunks).tolist()

    with Session(engine) as session:
        session.exec(delete(KnowledgeChunk))
        for content, embedding in zip(chunks, embeddings):
            session.add(KnowledgeChunk(content=content, embedding=embedding))
        session.commit()

    print(f"Indicizzati {len(chunks)} chunk.")


if __name__ == "__main__":
    main()
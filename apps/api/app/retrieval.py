from functools import lru_cache

from sentence_transformers import SentenceTransformer
from sqlmodel import Session, select

from .models import KnowledgeChunk

MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(MODEL_NAME)


def embed_query(query: str) -> list[float]:
    model = get_embedding_model()
    return model.encode(query).tolist()


def retrieve_relevant_chunks(session: Session, query: str, top_k: int = 3) -> list[str]:
    query_embedding = embed_query(query)
    results = session.exec(
        select(KnowledgeChunk)
        .order_by(KnowledgeChunk.embedding.cosine_distance(query_embedding))
        .limit(top_k)
    ).all()
    return [chunk.content for chunk in results]
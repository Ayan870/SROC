from typing import List

class EmbeddingService:
    """Service to create vector representations for search queries and document chunks."""
    
    def __init__(self):
        # Placeholder for OpenAI, Voyage AI, or Ollama local models
        pass
        
    async def get_embedding(self, text: str) -> List[float]:
        """Generate vector embedding for a single text."""
        # Standard placeholder dimension: 1536 float values
        return [0.0] * 1536
        
    async def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate vector embeddings for a list of texts."""
        return [[0.0] * 1536 for _ in texts]

embedding_service = EmbeddingService()

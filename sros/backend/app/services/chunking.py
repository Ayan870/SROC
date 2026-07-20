from typing import List, Dict, Any

class TextChunker:
    """Service to handle semantic and recursive character chunking of documents."""
    
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[Dict[str, Any]]:
        """Split raw text into chunk structures with offsets and lengths."""
        # Simple character-based splitting placeholder
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + self.chunk_size, len(text))
            chunk_content = text[start:end]
            chunks.append({
                "content": chunk_content,
                "start_idx": start,
                "end_idx": end
            })
            start += self.chunk_size - self.chunk_overlap
        return chunks

text_chunker = TextChunker()

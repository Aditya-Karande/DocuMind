from sentence_transformers import SentenceTransformer

class EmbeddingManger:
    def __init__(self,model_name="all-MiniLM-L6-v2"):
        self.model_name = model_name
        print("Loading Model..",self.model_name)
        self.model = SentenceTransformer(self.model_name)
        print("Model Dimensions: ",self.model.get_embedding_dimension())

    def create_embeddings(self, text):
        embeddings = self.model.encode(text, show_progress_bar=True)
        print("Shape of Embeddings: ",embeddings.shape)
        return embeddings
    
print("IMPORTING EMBEDDINGS.PY")

from sentence_transformers import SentenceTransformer

print("SENTENCE TRANSFORMERS IMPORTED")

class EmbeddingManger:
    _model = None

    def __init__(self,model_name="all-MiniLM-L6-v2"):
        self.model_name = model_name
        print("Loading Model..",self.model_name)

        if EmbeddingManger._model is None:   
            print("Loading model for first time.")
            EmbeddingManger._model = SentenceTransformer(model_name)
        
        self.model = EmbeddingManger._model
        print("Model Dimensions: ",self.model.get_embedding_dimension())

    def create_embeddings(self, text):
        embeddings = self.model.encode(text, show_progress_bar=True)
        print("Shape of Embeddings: ",embeddings.shape)
        return embeddings
    
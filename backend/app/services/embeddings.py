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

    def create_embeddings(self, texts):
        batch_size = 16
        all_embeddings = []

        for i in range(0, len(texts), batch_size):

            batch = texts[i:i + batch_size]

            embeddings = self.model.encode(
                batch,
                show_progress_bar=False
            )

            all_embeddings.extend(embeddings)

        return all_embeddings
    
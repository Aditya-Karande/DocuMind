from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
from pathlib import Path
from app.database.curd import get_recent_messages
from groq import RateLimitError
from fastapi import HTTPException
import json

#LLM Integration
load_dotenv(Path(__file__).resolve().parents[2] / ".env")
GROQ_API_KEY = os.getenv("API_KEY") or os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("Missing API key. Set API_KEY or GROQ_API_KEY in the .env file.")

LLM = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.4,
    max_tokens=800 
)

def rewrite_query(query,conversation_history):
    if not conversation_history.strip():
        return query
    
    rewrite_prompt = f"""
    Given Conversation history below, rewrite the users latest query into a standalone, self-contained question that includes all neccessary context.

    Conversation History:
    {conversation_history}

    Latest Query: {query}

    Rewritten query (return only the rewritten question, nothing else): 
"""
    rewritten = LLM.invoke(rewrite_prompt)
    return rewritten.content.strip()

#prompt
def generate_prompt(query, context, conversation_history):

    prompt = f"""
You are a helpful AI study assistant.

Answer only from the provided context.
Use simple and easy English.
Explain concepts clearly using short paragraphs or bullet points.
If the answer is not in the context, say:
"I could not find the answer in the uploaded notes."
Do not make up information.

Try to add small and simple example for users better understanding

You MUST format every answer using valid Markdown.

Rules:
1. Use # for title.
2. Use ## for section headings.
3. Use bullet points using "-".
4. Leave a blank line between sections.
5. Never write plain text sections.
6. user proper spacing for well structured response.
7. Use relevant emojis in section headings.
8. When explaining concepts, always bold important terms.

Even if the context is plain text,
rewrite the final answer in proper markdown.

Conversation History:
{conversation_history}

Context:
{context}

Query:
{query}

Answer:
    """
    return prompt

#output generation
def generate_output(db, query, chat_id, top_k=10):

    from .embeddings import EmbeddingManger
    from .vector_store import VectorStoreManager
    from .retriever import RAGRetriever

    try:
        print("STEP 1: generate_output started")

        embedding_manager = EmbeddingManger()
        print("STEP 2: EmbeddingManager created")

        vector_store = VectorStoreManager(chat_id)
        print("STEP 3: VectorStoreManager created")

        rag_retriever = RAGRetriever(embedding_manager, vector_store)
        print("STEP 4: Retriever created")

        message = get_recent_messages(
            db=db,
            chat_id=chat_id,
            limit=6
        )
        print("STEP 5: Messages fetched")

        conversation_history = ""

        for msg in reversed(message):
            conversation_history += f"""
{msg.role}:
{msg.content}

"""

        standalone_query = rewrite_query(query, conversation_history)
        print("STEP 6: Query rewritten")

        results = rag_retriever.retrieve(standalone_query, top_k)
        print("STEP 7: Retrieval complete")

        # keep your existing context code here

        if not context:
            print("STEP 8: No context found")
            return {
                "answer":"No relavent content found for the given query...",
                "sources":[]
            }

        print("STEP 9: Context built")

        prompt = generate_prompt(query, context, conversation_history)
        print("STEP 10: Prompt generated")

        answer = LLM.invoke(prompt)
        print("STEP 11: LLM response received")

        return {
            "answer": answer.content,
            "sources": sources,
            "error": None
        }

    except Exception as e:
        print("RAG ERROR:", str(e))
        raise

#generate summary
def generate_summary(db, chat_id):
    vector_store = VectorStoreManager(chat_id=chat_id)

    #get all chunks directly (no query.)
    all_docs = vector_store.get_all_docs()
    all_txt = "\n".join([doc['document'] for doc in all_docs])

    prompt = f"""
You are an expert document analyst.

Create a well-structured summary of the document.

Requirements:
- Use Markdown formatting.
- Start with a title using #.
- Divide the summary into sections using ## headings.
- Use bullet points for important information.
- Bold important concepts, keywords, and terms.
- Cover all major topics from the document.
- Keep the summary concise but informative.
- Do not repeat information.
- Make the summary easy to read for students.

Format Example:

# Document Summary

## Main Topic 1
- **Important Point 1**
- **Important Point 2**

## Main Topic 2
- **Important Point 3**
- **Important Point 4**

## Key Takeaways
- **Takeaway 1**
- **Takeaway 2**

Document:
{all_txt}

Summary:
"""
    try:
        response = LLM.invoke(prompt)

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="Daily AI limit reached. Please try again later."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summary generation failed: {str(e)}"
        )

    return response.content

#generate quiz
def generate_quiz(db, chat_id, num_questions=5):
    vector_store = VectorStoreManager(chat_id)
    all_docs = vector_store.get_all_docs()
    all_text = "\n".join([doc["document"] for doc in all_docs])

    prompt = f"""
Generate {num_questions} multiple choice questions based on the document below.

Return ONLY a valid JSON array, no extra text, no markdown, no backticks.
Format:
[
  {{
    "question": "question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correct_answer": 0
  }}
]

correct_answer is the index (0 for A, 1 for B, 2 for C, 3 for D).

Document:
{all_text}
"""
    try:
        response = LLM.invoke(prompt)

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="Daily AI limit reached. Please try again later."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quiz generation failed: {str(e)}"
        )
    
    try:
        return json.loads(response.content.strip())
    except:
        return []
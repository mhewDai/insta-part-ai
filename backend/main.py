from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import ChatMessage, ChatResponse, CompatibilityCheck
from app.services.deepseek_service import DeepseekService
from app.services.rag_service import RAGService

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="PartSelect Chat Agent", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
deepseek_service = DeepseekService()
rag_service = RAGService()

@app.get("/")
async def root():
    return {"message": "PartSelect Chat Agent API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "partselect-chat-agent"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Main chat endpoint that processes user messages"""
    try:
        user_message = message.message.strip()
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Step 1: Classify user intent
        intent = deepseek_service.classify_intent(user_message)
        
        # Step 2: Get relevant context from RAG
        context = rag_service.get_context_for_query(user_message, intent)
        
        # Step 3: Generate response with Deepseek
        ai_response = deepseek_service.generate_response(user_message, context)
        
        # Step 4: Get product suggestions if relevant
        product_suggestions = []
        if intent in ["product_search", "compatibility", "installation"]:
            products = rag_service.search_products(user_message)
            product_suggestions = [product.dict() for product in products[:3]]
        
        return ChatResponse(
            response=ai_response,
            part_suggestions=product_suggestions if product_suggestions else None,
            sources=["PartSelect Product Database"] if context else None
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/compatibility")
async def check_compatibility(compatibility: CompatibilityCheck):
    """Check if a part is compatible with a specific model"""
    try:
        result = rag_service.check_compatibility(
            compatibility.part_number, 
            compatibility.model_number
        )
        return result
    except Exception as e:
        print(f"Error in compatibility check: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/products")
async def get_products(search: str = None, category: str = None):
    """Get products with optional search and category filter"""
    try:
        if search:
            products = rag_service.search_products(search, category)
        else:
            products = rag_service.products
            if category:
                products = [p for p in products if p.category.lower() == category.lower()]
        
        return {"products": [product.dict() for product in products]}
    except Exception as e:
        print(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
# PartSelect Chat Agent Backend

FastAPI backend for the PartSelect chat agent with Deepseek AI integration and RAG (Retrieval-Augmented Generation) capabilities.

## Features

- Chat endpoint with Deepseek AI integration
- Product search and compatibility checking
- RAG service for context-aware responses
- Intent classification for better response routing
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in `.env`:
```
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGINS=http://localhost:3000
```

3. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `POST /api/chat` - Main chat endpoint
- `POST /api/compatibility` - Check part compatibility
- `GET /api/products` - Get products with optional search/filter
- `GET /health` - Health check endpoint

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── app/
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── services/
│   │   ├── deepseek_service.py  # Deepseek AI integration
│   │   └── rag_service.py       # RAG and product search
│   └── data/
│       └── products.json   # Product database
├── requirements.txt
└── .env                    # Environment variables
```

## Frontend Integration

The backend is designed to work with the React frontend in the parent directory. The frontend makes API calls to this backend for chat functionality and product information.
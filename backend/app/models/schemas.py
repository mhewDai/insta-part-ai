from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    part_suggestions: Optional[List[dict]] = None
    sources: Optional[List[str]] = None

class Product(BaseModel):
    id: str
    name: str
    category: str
    brand: str
    description: str
    price: float
    compatible_models: List[str]
    installation_guide: str
    image_url: Optional[str] = None

class CompatibilityCheck(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    part_number: str
    model_number: str
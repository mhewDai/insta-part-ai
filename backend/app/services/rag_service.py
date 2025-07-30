import json
import os
from typing import List, Dict, Optional
from app.models.schemas import Product

class RAGService:
    def __init__(self):
        self.products = self._load_products()
    
    def _load_products(self) -> List[Product]:
        """Load products from JSON file"""
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            products_path = os.path.join(current_dir, "..", "data", "products.json")
            
            with open(products_path, 'r') as f:
                data = json.load(f)
            
            products = []
            for product_data in data.get("products", []):
                products.append(Product(**product_data))
            
            return products
        except Exception as e:
            print(f"Error loading products: {e}")
            return []
    
    def search_products(self, query: str, category: Optional[str] = None) -> List[Product]:
        """Simple text-based product search"""
        query_lower = query.lower()
        results = []
        
        for product in self.products:
            # Search in name, description, and compatible models
            search_text = f"{product.name} {product.description} {' '.join(product.compatible_models)}".lower()
            
            # Category filter
            if category and product.category.lower() != category.lower():
                continue
            
            # Simple keyword matching
            if (query_lower in search_text or 
                product.id.lower() == query_lower or
                any(query_lower in model.lower() for model in product.compatible_models)):
                results.append(product)
        
        return results[:5]  # Return top 5 results
    
    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        """Get specific product by ID"""
        for product in self.products:
            if product.id.lower() == product_id.lower():
                return product
        return None
    
    def check_compatibility(self, part_id: str, model_number: str) -> Dict:
        """Check if a part is compatible with a model"""
        product = self.get_product_by_id(part_id)
        
        if not product:
            return {
                "compatible": False,
                "message": f"Part {part_id} not found in our database."
            }
        
        is_compatible = any(
            model_number.upper() in model.upper() or model.upper() in model_number.upper()
            for model in product.compatible_models
        )
        
        if is_compatible:
            return {
                "compatible": True,
                "message": f"Yes! Part {product.name} ({part_id}) is compatible with model {model_number}.",
                "product": product.dict()
            }
        else:
            return {
                "compatible": False,
                "message": f"Part {product.name} ({part_id}) is not compatible with model {model_number}.",
                "compatible_models": product.compatible_models,
                "product": product.dict()
            }
    
    def get_context_for_query(self, query: str, intent: str) -> str:
        """Get relevant context based on query and intent"""
        context_parts = []
        
        if intent == "product_search":
            products = self.search_products(query)
            if products:
                context_parts.append("AVAILABLE PRODUCTS:")
                for product in products:
                    context_parts.append(f"- {product.name} ({product.id}): {product.description}")
        
        elif intent == "compatibility":
            # Try to extract part numbers and model numbers from query
            words = query.upper().split()
            for word in words:
                if word.startswith("PS") or word.startswith("WDT"):
                    product = self.get_product_by_id(word)
                    if product:
                        context_parts.append(f"PART INFO: {product.name} ({product.id})")
                        context_parts.append(f"Compatible with: {', '.join(product.compatible_models)}")
        
        elif intent == "installation":
            # Look for part numbers in query
            words = query.upper().split()
            for word in words:
                if word.startswith("PS"):
                    product = self.get_product_by_id(word)
                    if product:
                        context_parts.append(f"INSTALLATION GUIDE for {product.name}:")
                        context_parts.append(product.installation_guide)
        
        return "\n".join(context_parts) if context_parts else ""
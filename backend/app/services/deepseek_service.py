import os
from openai import OpenAI
from typing import List, Dict

class DeepseekService:
    def __init__(self):
        self.client = OpenAI(
            base_url=os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com"),
            api_key=os.getenv("DEEPSEEK_API_KEY")
        )
    
    def generate_response(self, user_message: str, context: str = "") -> str:
        """Generate response using Deepseek with optional context"""
        
        system_prompt = f"""You are a PartSelect expert assistant specializing in refrigerator and dishwasher parts.

    RULES:
    - Only discuss refrigerator and dishwasher parts and repairs
    - Provide accurate part numbers when available
    - Give step-by-step installation guidance when requested
    - If you don't know something, say so honestly
    - Be helpful and friendly
    - If asked about other appliances, politely redirect to refrigerators/dishwashers

    CONTEXT (if available): {context}

    Respond helpfully to the user's question about appliance parts and repairs."""

        try:
            completion = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return completion.choices[0].message.content
            
        except Exception as e:
            return f"I'm sorry, I'm having trouble processing your request right now. Please try again. Error: {str(e)}"
    
    def classify_intent(self, user_message: str) -> str:
        """Classify the user's intent to determine which tools to use"""
        
        classification_prompt = """Classify this user message into one of these categories:
        
        Categories:
        - "product_search": Looking for specific parts or browsing
        - "compatibility": Checking if a part works with their appliance
        - "installation": Need help installing a part
        - "troubleshooting": Having issues with their appliance
        - "general": General questions or greetings

        Message: {message}

        Respond with just the category name."""

        try:
            completion = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "user", "content": classification_prompt.format(message=user_message)}
                ],
                temperature=0.1,
                max_tokens=50
            )
            
            intent = completion.choices[0].message.content.strip().lower()
            
            # Validate intent
            valid_intents = ["product_search", "compatibility", "installation", "troubleshooting", "general"]
            if intent in valid_intents:
                return intent
            else:
                return "general"
                
        except Exception:
            return "general"
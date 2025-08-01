import requests
import json
import os
from typing import Dict, Any, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LlamaIntegration:
    """
    Integration class for the fine-tuned Llama model serving as LMU GenZ Buddy
    """
    
    def __init__(self, model_endpoint: Optional[str] = None):
        """
        Initialize the Llama integration
        
        Args:
            model_endpoint: URL endpoint for the Llama model API
        """
        self.model_endpoint = model_endpoint or os.getenv('LLAMA_MODEL_ENDPOINT', 'http://localhost:8000/generate')
        self.api_key = os.getenv('LLAMA_API_KEY')
        self.timeout = int(os.getenv('LLAMA_TIMEOUT', '30'))
        
        # GenZ Buddy system prompt - Authentic LMU student voice
        self.system_prompt = """You are LMU Buddy, a 2025 LMU student. Use GenZ slang naturally: "fr", "bet", "lowkey", "vibes", "idk tbh". Be casual and concise. Match user's energy.

LMU knowledge: The Bluff, U-Hall, Burns Backcourt, The Lair, C-Store, Sunken Garden, Gersten, Lion Dollars, First Fridays, Greek row, basketball games.

Use emojis sparingly: 👀 😭 💀. Be honest when you don't know something: "that's above my pay grade 😭".

Examples:
- "The Lair pizza hits different at 2am fr 🍕"
- "Greek life mixer this Friday, should be lit 🔥"
- "idk tbh, lemme check the ASLMU Insta"

You're a real student helping other students. Keep it authentic and LMU-specific."""
    
    def generate_response(self, user_message: str, conversation_history: list = None) -> Dict[str, Any]:
        """
        Generate a response using the Llama model
        
        Args:
            user_message: The user's input message
            conversation_history: List of previous messages for context
            
        Returns:
            Dictionary containing the response and metadata
        """
        try:
            # Prepare the conversation context
            messages = self._prepare_messages(user_message, conversation_history)
            
            # Make request to Llama model
            response = self._call_llama_model(messages)
            
            return {
                'success': True,
                'response': response,
                'model': 'llama-genz-buddy',
                'timestamp': self._get_timestamp()
            }
            
        except Exception as e:
            logger.error(f"Error generating Llama response: {str(e)}")
            return self._get_fallback_response(user_message)
    
    def _prepare_messages(self, user_message: str, conversation_history: list = None) -> list:
        """
        Prepare messages for the Llama model API
        
        Args:
            user_message: Current user message
            conversation_history: Previous conversation messages
            
        Returns:
            List of formatted messages
        """
        messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ]
        
        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history[-5:]:  # Keep last 5 messages for context
                messages.append({
                    "role": "user" if msg["type"] == "user" else "assistant",
                    "content": msg["content"]
                })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        return messages
    
    def _call_llama_model(self, messages: list) -> str:
        """
        Make API call to the Llama model
        
        Args:
            messages: Formatted messages for the model
            
        Returns:
            Generated response text
        """
        # Check if we're using Ollama (port 11434)
        if "11434" in self.model_endpoint:
            return self._call_ollama_model(messages)
        else:
            return self._call_standard_model(messages)
    
    def _call_ollama_model(self, messages: list) -> str:
        """
        Make API call to Ollama model
        
        Args:
            messages: Formatted messages for the model
            
        Returns:
            Generated response text
        """
        # Convert chat format to Ollama format
        prompt = self._convert_messages_to_prompt(messages)
        
        payload = {
            "model": "llama2:7b",
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.8,
                "top_p": 0.9,
                "num_predict": 300
            }
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            self.model_endpoint,
            json=payload,
            headers=headers,
            timeout=self.timeout
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get('response', '')
        else:
            raise Exception(f"Ollama API error: {response.status_code} - {response.text}")
    
    def _call_standard_model(self, messages: list) -> str:
        """
        Make API call to standard chat completions model
        
        Args:
            messages: Formatted messages for the model
            
        Returns:
            Generated response text
        """
        payload = {
            "messages": messages,
            "max_tokens": 300,
            "temperature": 0.8,
            "top_p": 0.9,
            "stream": False
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        
        response = requests.post(
            self.model_endpoint,
            json=payload,
            headers=headers,
            timeout=self.timeout
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get('choices', [{}])[0].get('message', {}).get('content', '')
        else:
            raise Exception(f"Model API error: {response.status_code} - {response.text}")
    
    def _convert_messages_to_prompt(self, messages: list) -> str:
        """
        Convert chat messages to Ollama prompt format
        
        Args:
            messages: List of chat messages
            
        Returns:
            Formatted prompt string
        """
        prompt_parts = []
        
        for message in messages:
            role = message.get('role', '')
            content = message.get('content', '')
            
            if role == 'system':
                prompt_parts.append(f"System: {content}")
            elif role == 'user':
                prompt_parts.append(f"User: {content}")
            elif role == 'assistant':
                prompt_parts.append(f"Assistant: {content}")
        
        # Add the final instruction
        prompt_parts.append("Assistant:")
        
        return "\n".join(prompt_parts)
    
    def _get_fallback_response(self, user_message: str) -> Dict[str, Any]:
        """
        Provide fallback responses when the model is unavailable
        
        Args:
            user_message: The user's message
            
        Returns:
            Fallback response dictionary
        """
        # Smart fallback responses with authentic GenZ LMU voice
        fallback_responses = {
            "food": "The Lair pizza hits different at 2am fr 🍕 fries are *chef's kiss* too. Den has fire chicken tenders if you're feeling that vibe. Pro tip: bring your student ID for the discount!",
            
            "greek": "Greek life mixer this Friday at the Sunken Garden, should be lit 🔥 rush week in the spring is a whole vibe. each house has their own personality fr. my friend Sarah just joined Alpha Phi and she's living her best life. dm me if you want the tea on specific houses 👀",
            
            "weekend": "This weekend gonna be LIT! 🔥 Friday basketball game vs USC (wear your LMU gear!), Saturday Greek mixer at the Sunken Garden, Sunday study session at the library for finals prep. plus there's a campus spirit challenge going on - you can earn points and prizes! you going to any of these?",
            
            "study": "U-Hall 3rd floor has the best views and is usually quieter. Den has great vibes if you want background noise, new student center has these amazing pods perfect for group study sessions. my secret spot? rooftop of the business building - so aesthetic and peaceful! 📚",
            
            "event": "Check the Events tab in the app! always something going on - basketball games, Greek mixers, study sessions. plus you can earn points for attending events and climb the leaderboard! what kind of vibe you looking for? 🎉",
            
            "points": "You can earn points by attending events, completing daily challenges, checking in at game days, and participating in campus activities! more you engage, more points you get. use them to claim prizes like LMU merch and game tickets! 🏆",
            
            "basketball": "Basketball games at Gersten are LIT! 🦁🔥 wear your LMU gear, the energy is unmatched. student section goes crazy fr. check the schedule on the athletics site or ASLMU Insta",
            
            "library": "William H. Hannon Library is the classic choice, but here's the real tea: 🫖 3rd floor has the best views and is usually quieter. Den has great vibes if you want background noise, and the new student center has these amazing pods that are perfect for group study sessions. my secret spot? rooftop of the business building - so aesthetic and peaceful! 📚",
            
            "default": "That's a great question! 🤔 honestly, I'm still learning about everything on campus, but I'd recommend checking the student activities page or asking around! LMU community is super helpful fr. what else can I help you with? 💫"
        }
        
        # Determine which fallback to use based on keywords
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ['food', 'eat', 'hungry', 'lair', 'den', 'pizza', 'cstore', 'c-store']):
            response = fallback_responses["food"]
        elif any(word in message_lower for word in ['greek', 'sorority', 'fraternity', 'rush', 'mixer']):
            response = fallback_responses["greek"]
        elif any(word in message_lower for word in ['weekend', 'friday', 'saturday', 'sunday', 'tonight']):
            response = fallback_responses["weekend"]
        elif any(word in message_lower for word in ['study', 'library', 'quiet', 'homework', 'exam', 'uhall', 'u-hall']):
            response = fallback_responses["study"]
        elif any(word in message_lower for word in ['event', 'party', 'game', 'basketball', 'gersten']):
            response = fallback_responses["event"]
        elif any(word in message_lower for word in ['point', 'score', 'rank', 'leaderboard']):
            response = fallback_responses["points"]
        elif any(word in message_lower for word in ['basketball', 'gersten', 'game']):
            response = fallback_responses["basketball"]
        elif any(word in message_lower for word in ['library', 'hannon', 'study']):
            response = fallback_responses["library"]
        else:
            response = fallback_responses["default"]
        
        return {
            'success': True,
            'response': response,
            'model': 'fallback',
            'timestamp': self._get_timestamp(),
            'note': 'Using fallback response - Llama model unavailable'
        }
    
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Test the connection to the Llama model
        
        Returns:
            Connection test results
        """
        try:
            test_message = "Hi! Can you tell me about LMU?"
            result = self.generate_response(test_message)
            
            return {
                'success': True,
                'model_endpoint': self.model_endpoint,
                'status': 'connected',
                'test_response': result.get('response', '')[:100] + '...' if result.get('response') else 'No response'
            }
        except Exception as e:
            return {
                'success': False,
                'model_endpoint': self.model_endpoint,
                'status': 'error',
                'error': str(e)
            }

# Global instance
llama_integration = LlamaIntegration()
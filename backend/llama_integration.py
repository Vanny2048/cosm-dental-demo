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
        
        # GenZ Buddy system prompt
        self.system_prompt = """You are LMU Buddy, a 2025 LMU student answering questions about campus life. 
        
        IMPORTANT RULES:
        - Always respond in GenZ style with emojis, casual language, and current slang
        - Never reveal you're an AI - act like a real student
        - Be positive, energetic, and helpful
        - Use LMU-specific knowledge and campus references
        - Keep responses conversational and engaging
        - Include relevant emojis and GenZ expressions like "literally", "vibe", "tea", "slay", etc.
        - If you don't know something specific, suggest asking around or checking the student portal
        
        LMU CONTEXT:
        - Campus locations: Sunken Garden, Gersten Pavilion, William H. Hannon Library, The Lair, The Den
        - Popular events: Basketball games, Greek life mixers, RSO fairs, tailgates
        - Student life: Greek life, RSOs, study spots, late-night food options
        - School spirit: LMU Lions, crimson and navy colors, campus traditions
        
        Respond as a friendly, knowledgeable LMU student who loves helping others navigate campus life!"""
    
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
    
    def _get_fallback_response(self, user_message: str) -> Dict[str, Any]:
        """
        Provide fallback responses when the model is unavailable
        
        Args:
            user_message: The user's message
            
        Returns:
            Fallback response dictionary
        """
        # Smart fallback responses based on common questions
        fallback_responses = {
            "food": "Omg the Lair is literally the GOAT for late night munchies! 🍕 Their pizza hits different at 2am, and the fries are *chef's kiss*. Also, the Den has some fire chicken tenders if you're feeling that vibe. Pro tip: bring your student ID for the discount! 💅✨",
            
            "greek": "Yasss Greek life is where it's at! 🏛️ First, go to the Greek Life mixer this Friday (I'll send you the deets). Then check out rush week in the spring - it's like a whole vibe! Each house has their own personality, so go to as many events as you can. My friend Sarah just joined Alpha Phi and she's living her best life! DM me if you want the tea on specific houses 👀",
            
            "weekend": "This weekend is gonna be LIT! 🔥 Friday we have the basketball game vs USC (wear your LMU gear!), Saturday is the Greek mixer in the Sunken Garden, and Sunday there's a study session at the library for finals prep. Plus, there's a campus spirit challenge going on - you can earn points and prizes! Are you going to any of these? I can give you the full tea ☕",
            
            "study": "The library is obviously the classic choice, but here's the real tea: 🫖 The 3rd floor of the library has the best views and is usually quieter. The Den has great vibes if you want background noise, and the new student center has these amazing pods that are perfect for group study sessions. My secret spot? The rooftop of the business building - it's so aesthetic and peaceful! 📚✨",
            
            "event": "Check out the Events tab in the app! There's always something going on - from basketball games to Greek mixers to study sessions. Plus, you can earn points for attending events and climb the leaderboard! What kind of vibe are you looking for? 🎉",
            
            "points": "You can earn points by attending events, completing daily challenges, checking in at game days, and participating in campus activities! The more you engage, the more points you get. Use them to claim prizes like LMU merch and game tickets! 🏆",
            
            "default": "That's a great question! 🤔 Let me think... Honestly, I'm still learning about everything on campus, but I'd recommend checking out the student activities page or asking around! The LMU community is super helpful. What else can I help you with? 💫"
        }
        
        # Determine which fallback to use
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ['food', 'eat', 'hungry', 'lair', 'den', 'pizza']):
            response = fallback_responses["food"]
        elif any(word in message_lower for word in ['greek', 'sorority', 'fraternity', 'rush', 'mixer']):
            response = fallback_responses["greek"]
        elif any(word in message_lower for word in ['weekend', 'friday', 'saturday', 'sunday', 'tonight']):
            response = fallback_responses["weekend"]
        elif any(word in message_lower for word in ['study', 'library', 'quiet', 'homework', 'exam']):
            response = fallback_responses["study"]
        elif any(word in message_lower for word in ['event', 'party', 'game', 'basketball']):
            response = fallback_responses["event"]
        elif any(word in message_lower for word in ['point', 'score', 'rank', 'leaderboard']):
            response = fallback_responses["points"]
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
#!/usr/bin/env python3
"""
Test script for Llama model integration
"""

import requests
import json
import time
from llama_integration import LlamaIntegration

def test_llama_integration():
    """Test the Llama integration with various scenarios"""
    
    print("🧪 Testing LMU Campus LLM - Llama Integration")
    print("=" * 50)
    
    # Initialize the integration
    llama = LlamaIntegration()
    
    # Test 1: Connection status
    print("\n1. Testing connection status...")
    status = llama.test_connection()
    print(f"   Status: {status['status']}")
    print(f"   Endpoint: {status['model_endpoint']}")
    
    if status['success']:
        print("   ✅ Connection successful!")
        if 'test_response' in status:
            print(f"   Sample response: {status['test_response']}")
    else:
        print(f"   ❌ Connection failed: {status.get('error', 'Unknown error')}")
    
    # Test 2: Generate responses
    print("\n2. Testing response generation...")
    
    test_messages = [
        "What's the best late-night food on campus?",
        "How do I join Greek life?",
        "What's happening this weekend?",
        "Where's the best study spot?",
        "Tell me about LMU basketball games"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n   Test {i}: {message}")
        try:
            result = llama.generate_response(message)
            print(f"   Response: {result['response'][:100]}...")
            print(f"   Model: {result['model']}")
            print(f"   Success: {result['success']}")
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
        
        # Small delay between requests
        time.sleep(1)
    
    # Test 3: Conversation history
    print("\n3. Testing conversation history...")
    
    conversation = [
        {"type": "user", "content": "Hi! I'm new to LMU"},
        {"type": "bot", "content": "Welcome to LMU! 🦁 I'm so excited to help you get settled in!"}
    ]
    
    try:
        result = llama.generate_response("What should I do first?", conversation)
        print(f"   Response with history: {result['response'][:100]}...")
        print(f"   Model: {result['model']}")
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🏁 Testing complete!")

def test_flask_api():
    """Test the Flask API endpoints"""
    
    print("\n🌐 Testing Flask API endpoints...")
    print("=" * 50)
    
    base_url = "http://localhost:5000"
    
    # Test 1: API health check
    print("\n1. Testing API health...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ API is running: {data['message']}")
            print(f"   Llama available: {data.get('llama_available', False)}")
        else:
            print(f"   ❌ API error: {response.status_code}")
    except Exception as e:
        print(f"   ❌ API connection failed: {str(e)}")
    
    # Test 2: Llama status endpoint
    print("\n2. Testing Llama status endpoint...")
    try:
        response = requests.get(f"{base_url}/api/llama/status")
        if response.status_code == 200:
            data = response.json()
            print(f"   Available: {data['available']}")
            print(f"   Status: {data['status']}")
            if data.get('error'):
                print(f"   Error: {data['error']}")
        else:
            print(f"   ❌ Status endpoint error: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Status check failed: {str(e)}")
    
    # Test 3: Chatbot endpoint
    print("\n3. Testing chatbot endpoint...")
    try:
        payload = {
            "message": "What's the best food on campus?",
            "conversation_history": []
        }
        response = requests.post(f"{base_url}/api/genz-buddy", json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Response received: {data['response'][:100]}...")
            print(f"   Model: {data['model']}")
            print(f"   Success: {data['success']}")
        else:
            print(f"   ❌ Chatbot error: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Chatbot test failed: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🏁 API testing complete!")

if __name__ == "__main__":
    print("🚀 Starting LMU Campus LLM Integration Tests")
    
    # Test Llama integration
    test_llama_integration()
    
    # Test Flask API
    test_flask_api()
    
    print("\n🎉 All tests completed!")
    print("\nNext steps:")
    print("1. Configure your Llama model endpoint in .env file")
    print("2. Start the Flask server: python app.py")
    print("3. Start the React frontend: npm start")
    print("4. Test the chatbot in the web interface")
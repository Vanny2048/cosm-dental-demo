#!/usr/bin/env python3
"""
LMU Campus LLM - Comprehensive Test Script
Tests all backend endpoints and functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, method="GET", data=None, expected_status=200):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
        else:
            print(f"❌ Unknown method: {method}")
            return False
            
        if response.status_code == expected_status:
            print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            if response.content:
                try:
                    result = response.json()
                    print(f"   Response: {json.dumps(result, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            return True
        else:
            print(f"❌ {method} {endpoint} - Expected {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {endpoint} - Connection failed (server not running?)")
        return False
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return False

def main():
    print("🦁 LMU Campus LLM - Comprehensive Test Suite")
    print("=" * 50)
    
    # Test basic endpoints
    print("\n📋 Testing Basic Endpoints...")
    test_endpoint("/")
    test_endpoint("/api/events")
    test_endpoint("/api/leaderboard")
    test_endpoint("/api/prizes")
    
    # Test waitlist endpoints
    print("\n📝 Testing Waitlist Endpoints...")
    
    # Test waitlist count
    test_endpoint("/api/waitlist/count")
    
    # Test valid waitlist signup
    valid_signup = {
        "name": "Test Student",
        "email": "test.student@lmu.edu",
        "student_id": "12345678",
        "phone": "(555) 123-4567",
        "graduation_year": "2026",
        "major": "Computer Science",
        "interests": ["Basketball Games", "Greek Life"],
        "referral_source": "website"
    }
    test_endpoint("/api/waitlist", "POST", valid_signup)
    
    # Test invalid waitlist signup (missing required fields)
    invalid_signup = {
        "name": "Test Student",
        "email": "test.student@lmu.edu"
        # Missing student_id
    }
    test_endpoint("/api/waitlist", "POST", invalid_signup, expected_status=400)
    
    # Test invalid student ID format
    invalid_id_signup = {
        "name": "Test Student",
        "email": "test.student2@lmu.edu",
        "student_id": "123456",  # Too short
        "major": "Computer Science"
    }
    test_endpoint("/api/waitlist", "POST", invalid_id_signup, expected_status=400)
    
    # Test user endpoints
    print("\n👤 Testing User Endpoints...")
    test_endpoint("/api/users/1")
    
    # Test chatbot
    print("\n🤖 Testing Chatbot...")
    chat_data = {
        "message": "What is the best food on campus?"
    }
    test_endpoint("/api/genz-buddy", "POST", chat_data)
    
    # Test event endpoints
    print("\n📅 Testing Event Endpoints...")
    test_endpoint("/api/events/1")
    
    # Test RSVP
    rsvp_data = {
        "user_id": 1
    }
    test_endpoint("/api/events/1/rsvp", "POST", rsvp_data)
    
    # Test check-in
    checkin_data = {
        "user_id": 1
    }
    test_endpoint("/api/events/1/checkin", "POST", checkin_data)
    
    # Test prize claiming
    print("\n🎁 Testing Prize Endpoints...")
    claim_data = {
        "user_id": 1
    }
    test_endpoint("/api/prizes/1/claim", "POST", claim_data)
    
    # Test Llama status
    print("\n🔧 Testing AI Model Status...")
    test_endpoint("/api/llama/status")
    
    print("\n" + "=" * 50)
    print("🎉 Test Suite Complete!")
    print("Check the results above to ensure all endpoints are working correctly.")

if __name__ == "__main__":
    main()
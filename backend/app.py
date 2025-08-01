from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
import logging

# Import the Llama integration
try:
    from llama_integration import llama_integration
    LLAMA_AVAILABLE = True
except ImportError:
    LLAMA_AVAILABLE = False
    logging.warning("Llama integration not available - using fallback responses")

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock data for development
mock_users = [
    {
        "id": 1,
        "name": "Alex Johnson",
        "email": "alex.johnson@lmu.edu",
        "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        "points": 1250,
        "rank": 15,
        "streak": 7,
        "orgs": ["Greek Life", "Student Government", "Basketball Club"],
        "badges": [
            {"id": 1, "name": "First Event", "icon": "🎉", "description": "Attended your first event"},
            {"id": 2, "name": "Week Warrior", "icon": "🔥", "description": "7-day streak"},
            {"id": 3, "name": "Social Butterfly", "icon": "🦋", "description": "Joined 3+ organizations"}
        ]
    }
]

mock_events = [
    {
        "id": 1,
        "title": "LMU vs USC Basketball Game",
        "type": "game",
        "date": "2024-02-15T19:00:00",
        "location": "Gersten Pavilion",
        "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop",
        "host": "LMU Athletics",
        "description": "Come support the Lions as they take on USC! Wear your LMU gear and show your school spirit!",
        "attendees": [1, 2, 3, 4, 5],
        "maxCapacity": 500,
        "checkedIn": [1, 2],
        "points": 100,
        "tags": ["basketball", "game-day", "spirit"]
    },
    {
        "id": 2,
        "title": "Greek Life Mixer",
        "type": "greek",
        "date": "2024-02-16T20:00:00",
        "location": "Sunken Garden",
        "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop",
        "host": "Greek Council",
        "description": "Join us for an evening of networking and fun with all Greek organizations!",
        "attendees": [1, 3, 6, 7, 8],
        "maxCapacity": 200,
        "checkedIn": [],
        "points": 75,
        "tags": ["greek", "social", "networking"]
    }
]

mock_prizes = [
    {
        "id": 1,
        "name": "LMU Hoodie",
        "description": "Official LMU branded hoodie",
        "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
        "pointCost": 500,
        "claimedBy": None,
        "status": "available"
    },
    {
        "id": 2,
        "name": "Game Day Tickets",
        "description": "VIP tickets to next basketball game",
        "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop",
        "pointCost": 1000,
        "claimedBy": None,
        "status": "available"
    }
]

@app.route('/')
def home():
    return jsonify({
        "message": "LMU Campus LLM API",
        "version": "1.0.0",
        "status": "running",
        "llama_available": LLAMA_AVAILABLE
    })

# User endpoints
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in mock_users if u["id"] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users/<int:user_id>/points', methods=['POST'])
def update_points(user_id):
    data = request.get_json()
    points = data.get('points', 0)
    
    user = next((u for u in mock_users if u["id"] == user_id), None)
    if user:
        user["points"] += points
        return jsonify({"success": True, "newPoints": user["points"]})
    return jsonify({"error": "User not found"}), 404

# Event endpoints
@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify(mock_events)

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = next((e for e in mock_events if e["id"] == event_id), None)
    if event:
        return jsonify(event)
    return jsonify({"error": "Event not found"}), 404

@app.route('/api/events/<int:event_id>/rsvp', methods=['POST'])
def rsvp_event(event_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    event = next((e for e in mock_events if e["id"] == event_id), None)
    if event:
        if user_id in event["attendees"]:
            event["attendees"].remove(user_id)
            return jsonify({"success": True, "action": "removed"})
        else:
            event["attendees"].append(user_id)
            return jsonify({"success": True, "action": "added"})
    return jsonify({"error": "Event not found"}), 404

@app.route('/api/events/<int:event_id>/checkin', methods=['POST'])
def checkin_event(event_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    event = next((e for e in mock_events if e["id"] == event_id), None)
    if event:
        if user_id not in event["checkedIn"]:
            event["checkedIn"].append(user_id)
            return jsonify({"success": True, "points": event["points"]})
        return jsonify({"error": "Already checked in"}), 400
    return jsonify({"error": "Event not found"}), 404

# Prize endpoints
@app.route('/api/prizes', methods=['GET'])
def get_prizes():
    return jsonify(mock_prizes)

@app.route('/api/prizes/<int:prize_id>/claim', methods=['POST'])
def claim_prize(prize_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    prize = next((p for p in mock_prizes if p["id"] == prize_id), None)
    user = next((u for u in mock_users if u["id"] == user_id), None)
    
    if not prize:
        return jsonify({"error": "Prize not found"}), 404
    if not user:
        return jsonify({"error": "User not found"}), 404
    if prize["claimedBy"]:
        return jsonify({"error": "Prize already claimed"}), 400
    if user["points"] < prize["pointCost"]:
        return jsonify({"error": "Insufficient points"}), 400
    
    prize["claimedBy"] = user_id
    prize["status"] = "claimed"
    user["points"] -= prize["pointCost"]
    
    return jsonify({"success": True, "remainingPoints": user["points"]})

# GenZ Buddy Chatbot endpoint with Llama integration
@app.route('/api/genz-buddy', methods=['POST'])
def genz_buddy():
    try:
        data = request.get_json()
        message = data.get('message', '')
        conversation_history = data.get('conversation_history', [])
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        # Use Llama integration if available
        if LLAMA_AVAILABLE:
            logger.info(f"Generating Llama response for: {message[:50]}...")
            result = llama_integration.generate_response(message, conversation_history)
            
            return jsonify({
                "response": result['response'],
                "model": result['model'],
                "timestamp": result['timestamp'],
                "success": result['success']
            })
        else:
            # Fallback to mock responses
            logger.info("Using fallback responses - Llama not available")
            return _get_mock_response(message)
            
    except Exception as e:
        logger.error(f"Error in genz-buddy endpoint: {str(e)}")
        return jsonify({
            "error": "Failed to generate response",
            "message": str(e)
        }), 500

def _get_mock_response(message):
    """Fallback mock responses when Llama is not available"""
    message_lower = message.lower()
    
    # Smart keyword matching for better responses with authentic GenZ voice
    if any(word in message_lower for word in ['food', 'eat', 'hungry', 'lair', 'den', 'pizza', 'cstore', 'c-store']):
        response = "The Lair pizza hits different at 2am fr 🍕 fries are *chef's kiss* too. Den has fire chicken tenders if you're feeling that vibe. Pro tip: bring your student ID for the discount!"
    elif any(word in message_lower for word in ['greek', 'sorority', 'fraternity', 'rush', 'mixer']):
        response = "Greek life mixer this Friday at the Sunken Garden, should be lit 🔥 rush week in the spring is a whole vibe. each house has their own personality fr. my friend Sarah just joined Alpha Phi and she's living her best life. dm me if you want the tea on specific houses 👀"
    elif any(word in message_lower for word in ['weekend', 'friday', 'saturday', 'sunday', 'tonight']):
        response = "This weekend gonna be LIT! 🔥 Friday basketball game vs USC (wear your LMU gear!), Saturday Greek mixer at the Sunken Garden, Sunday study session at the library for finals prep. plus there's a campus spirit challenge going on - you can earn points and prizes! you going to any of these?"
    elif any(word in message_lower for word in ['study', 'library', 'quiet', 'homework', 'exam', 'uhall', 'u-hall']):
        response = "U-Hall 3rd floor has the best views and is usually quieter. Den has great vibes if you want background noise, new student center has these amazing pods perfect for group study sessions. my secret spot? rooftop of the business building - so aesthetic and peaceful! 📚"
    elif any(word in message_lower for word in ['event', 'party', 'game', 'basketball', 'gersten']):
        response = "Check the Events tab in the app! always something going on - basketball games, Greek mixers, study sessions. plus you can earn points for attending events and climb the leaderboard! what kind of vibe you looking for? 🎉"
    elif any(word in message_lower for word in ['point', 'score', 'rank', 'leaderboard']):
        response = "You can earn points by attending events, completing daily challenges, checking in at game days, and participating in campus activities! more you engage, more points you get. use them to claim prizes like LMU merch and game tickets! 🏆"
    elif any(word in message_lower for word in ['basketball', 'gersten', 'game']):
        response = "Basketball games at Gersten are LIT! 🦁🔥 wear your LMU gear, the energy is unmatched. student section goes crazy fr. check the schedule on the athletics site or ASLMU Insta"
    elif any(word in message_lower for word in ['library', 'hannon', 'study']):
        response = "William H. Hannon Library is the classic choice, but here's the real tea: 🫖 3rd floor has the best views and is usually quieter. Den has great vibes if you want background noise, and the new student center has these amazing pods that are perfect for group study sessions. my secret spot? rooftop of the business building - so aesthetic and peaceful! 📚"
    else:
        response = "That's a great question! 🤔 honestly, I'm still learning about everything on campus, but I'd recommend checking the student activities page or asking around! LMU community is super helpful fr. what else can I help you with? 💫"
    
    return jsonify({
        "response": response,
        "model": "fallback",
        "timestamp": datetime.now().isoformat(),
        "success": True
    })

# Llama model status endpoint
@app.route('/api/llama/status', methods=['GET'])
def llama_status():
    """Check the status of the Llama model integration"""
    if not LLAMA_AVAILABLE:
        return jsonify({
            "available": False,
            "status": "not_configured",
            "message": "Llama integration module not available"
        })
    
    try:
        test_result = llama_integration.test_connection()
        return jsonify({
            "available": True,
            "status": test_result['status'],
            "model_endpoint": test_result['model_endpoint'],
            "test_response": test_result.get('test_response', ''),
            "error": test_result.get('error', None)
        })
    except Exception as e:
        return jsonify({
            "available": True,
            "status": "error",
            "error": str(e)
        })

# Leaderboard endpoint
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    # Mock leaderboard data
    leaderboard = [
        {"rank": 1, "name": "Sarah Chen", "points": 2500, "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"},
        {"rank": 2, "name": "Mike Rodriguez", "points": 2200, "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"},
        {"rank": 3, "name": "Emma Wilson", "points": 2000, "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"},
        {"rank": 4, "name": "Alex Johnson", "points": 1250, "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"},
        {"rank": 5, "name": "David Kim", "points": 1100, "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"}
    ]
    return jsonify(leaderboard)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
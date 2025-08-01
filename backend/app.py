from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

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
        "status": "running"
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

# GenZ Buddy Chatbot endpoint
@app.route('/api/genz-buddy', methods=['POST'])
def genz_buddy():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    # Mock responses for development
    responses = {
        "what's the best late-night food on campus": "Omg the Lair is literally the GOAT for late night munchies! 🍕 Their pizza hits different at 2am, and the fries are *chef's kiss*. Also, the Den has some fire chicken tenders if you're feeling that vibe. Pro tip: bring your student ID for the discount! 💅✨",
        
        "how do i join greek life": "Yasss Greek life is where it's at! 🏛️ First, go to the Greek Life mixer this Friday (I'll send you the deets). Then check out rush week in the spring - it's like a whole vibe! Each house has their own personality, so go to as many events as you can. My friend Sarah just joined Alpha Phi and she's living her best life! DM me if you want the tea on specific houses 👀",
        
        "what's happening this weekend": "This weekend is gonna be LIT! 🔥 Friday we have the basketball game vs USC (wear your LMU gear!), Saturday is the Greek mixer in the Sunken Garden, and Sunday there's a study session at the library for finals prep. Plus, there's a campus spirit challenge going on - you can earn points and prizes! Are you going to any of these? I can give you the full tea ☕",
        
        "where's the best study spot": "The library is obviously the classic choice, but here's the real tea: 🫖 The 3rd floor of the library has the best views and is usually quieter. The Den has great vibes if you want background noise, and the new student center has these amazing pods that are perfect for group study sessions. My secret spot? The rooftop of the business building - it's so aesthetic and peaceful! 📚✨"
    }
    
    # Find matching response
    response = None
    for key, value in responses.items():
        if key in message:
            response = value
            break
    
    if not response:
        response = "That's a great question! 🤔 Let me think... Honestly, I'm still learning about everything on campus, but I'd recommend checking out the student activities page or asking around! The LMU community is super helpful. What else can I help you with? 💫"
    
    return jsonify({
        "response": response,
        "timestamp": datetime.now().isoformat()
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
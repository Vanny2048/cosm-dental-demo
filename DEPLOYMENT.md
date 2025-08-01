# LMU Campus LLM - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Local Development Setup

1. **Clone and navigate to the project**
   ```bash
   cd /workspace
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Start Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   python app.py
   ```
   Backend will run on: http://localhost:5000

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on: http://localhost:3000

5. **Open your browser**
   - Navigate to: http://localhost:3000
   - The app should load with the LMU Campus LLM interface

## 🎯 What's Working Now

### ✅ Completed Features
- **Home Page**: Welcome screen with user stats, next big event banner, daily spirit challenge
- **Navigation**: Responsive mobile-first navigation with bottom nav for mobile
- **Buddy Chat**: Floating GenZ chatbot with mock responses and suggestions
- **User Context**: Mock user data with points, rank, badges, and notifications
- **Event Context**: Mock events with RSVP functionality
- **Backend API**: Flask server with endpoints for users, events, prizes, and chatbot
- **LMU Branding**: Complete design system with LMU colors and typography

### 🚧 Coming Soon
- Full Events page with calendar view
- Game Day Zone with check-in functionality
- Leaderboard with animated rankings
- Prizes showcase and claiming system
- User Profile page
- Host Zone for event creation
- Notifications system
- Real Llama model integration

## 🤖 GenZ Buddy Chatbot

The chatbot currently has mock responses for:
- "What's the best late-night food on campus?"
- "How do I join Greek life?"
- "What's happening this weekend?"
- "Where's the best study spot?"

**To integrate your fine-tuned Llama model:**

1. **Replace the mock responses** in `backend/app.py` line 150-160
2. **Add your model endpoint** to the `/api/genz-buddy` route
3. **Update the frontend** to call your actual model API

## 📱 Mobile-First Design

The app is fully responsive with:
- Bottom navigation on mobile devices
- Touch-friendly buttons and interactions
- Optimized layouts for all screen sizes
- LMU brand colors and typography

## 🔧 Configuration

### Environment Variables
```bash
# Backend
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///lmu_campus.db

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHATBOT_URL=http://localhost:5000/api/genz-buddy
```

## 🚀 Production Deployment

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

### Backend (Railway/Heroku)
1. Deploy Python Flask app
2. Set environment variables
3. Configure database connection
4. Deploy Llama model endpoint

## 📊 Next Steps

1. **Complete remaining pages** (Events, Game Day, Leaderboard, etc.)
2. **Integrate real database** (PostgreSQL)
3. **Add authentication** (LMU SSO or email-based)
4. **Deploy Llama model** for real chatbot responses
5. **Add real-time features** (WebSockets for live updates)
6. **Implement push notifications**
7. **Add photo/video upload** for challenges
8. **Geolocation check-ins**

## 🎨 Customization

### LMU Brand Colors
- Primary: `#8C1515` (LMU Crimson)
- Secondary: `#1B365D` (LMU Navy)
- Accent: `#D4AF37` (LMU Gold)

### Typography
- Headings: Montserrat
- Body: Inter

## 📞 Support

For questions or collaboration:
- Email: lmu-campus-llm@lmu.edu
- Discord: [LMU Campus LLM Community]

---

**Built with ❤️ for LMU Lions 🦁**
*Making campus life more engaging, social, and spirited through AI-powered student engagement.*
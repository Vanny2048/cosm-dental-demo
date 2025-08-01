# LMU Campus LLM Web App 🦁

*A student-driven engagement, event, and spirit platform, powered by a fine-tuned GenZ Llama chatbot for real-time campus guidance and hype.*

## 🌟 App Overview & Goals

- **Gamify campus participation**: Leaderboards, points, badges, wild prizes
- **Make it fun and social**: "FOMO engine" for tailgates, games, RSOs, and Greek life
- **Centralize campus info**: Event calendars, check-ins, RSVPs, trending spirit challenges
- **Unique twist**: AI-powered "LMU GenZ Buddy" for instant, student-voiced help and energy
- **Fully mobile-first, on-brand, lightning-fast** — no more boring or clunky campus systems

## 🚀 Core Features

### Pages & Flows
| Page | Key Actions & Features |
|------|----------------------|
| **Home** | Next Big Event banner, "You're ranked X", daily spirit challenge, live event preview, nav bar |
| **Events** | Card/calendar view of all events, colored by type, 1-click RSVP, map, social "who's going" info |
| **Game Day Zone** | Check-in (QR/geolocation), live spirit meter, challenge uploads (photo/vid), watch party map |
| **Leaderboard** | Ranks for individuals/orgs, badge ribbons, animated movement, "How I Rank" modals |
| **Prizes** | Grid of prizes (images, point values), claim & status, prize idea suggestions form |
| **Profile** | Avatar/points/streaks, badge gallery, events attended, RSVP status, edit options |
| **Host Zone** | Event submission form (title, type, date, image), status dashboard, quick preview |
| **Buddy Chat** | Full-page, chat-style LMU Buddy; shortcut chat button floating on every page |
| **Notifications** | RSVP reminders, leaderboard changes, claim prompts, custom settings for push messages |

## 🛠️ Tech Stack

- **Frontend**: React.js with modern hooks and context
- **Backend**: Python Flask REST API
- **Database**: SQLite for development, PostgreSQL for production
- **AI Integration**: Fine-tuned Llama model for GenZ Buddy chatbot
- **Styling**: CSS3 with LMU brand colors (#8C1515 crimson, navy, gold accents)
- **Deployment**: Netlify for frontend, Railway/Heroku for backend

## 🎨 Brand Identity

- **Colors**: LMU Crimson (#8C1515), Navy (#1B365D), Gold (#D4AF37)
- **Typography**: Montserrat for headings, Inter for body text
- **Vibe**: High-energy, fun, social, inclusive, modern

## 📱 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campus-llm-lmu.git
   cd campus-llm-lmu
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python app.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

5. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🤖 LMU GenZ Buddy Integration

The app features a fine-tuned Llama chatbot that:
- Answers questions in GenZ style about LMU life
- Provides event recommendations and campus tips
- Maintains positive, energetic tone
- Never reveals it's AI
- Available via floating button on every page

### Chatbot Features
- **Floating "Ask Buddy 🦁" button** on every page
- **Full chat page** with conversation history
- **Response rating** (thumbs up/down)
- **GenZ prompt suggestions** for quick questions
- **Safety filters** for inappropriate content

## 🎯 Development Roadmap

### Phase 1: Core UI & Navigation ✅
- [x] Project structure setup
- [x] LMU branding and design system
- [x] Responsive navigation
- [x] Page routing and layout

### Phase 2: Static Pages & Mockups
- [ ] Home page with event banner and leaderboard preview
- [ ] Events page with card/calendar view
- [ ] Game Day Zone with check-in interface
- [ ] Leaderboard with animated rankings
- [ ] Prizes showcase
- [ ] User profile page
- [ ] Host Zone for event submission

### Phase 3: Backend API
- [ ] User authentication system
- [ ] Event management endpoints
- [ ] Points and leaderboard logic
- [ ] Prize claiming system
- [ ] Check-in and RSVP functionality

### Phase 4: Chatbot Integration
- [ ] Llama model deployment
- [ ] Chatbot UI components
- [ ] API integration for chat responses
- [ ] Safety and filtering layers

### Phase 5: Advanced Features
- [ ] Real-time notifications
- [ ] Photo/video challenge uploads
- [ ] Geolocation check-ins
- [ ] Social features and sharing

## 📊 Database Schema

### Users
- id, email, name, avatar, points, streak, orgs, badges

### Events
- id, title, type, date, location, image, host, attendees, max_capacity

### CheckIns
- id, user_id, event_id, timestamp, location, points_earned

### Prizes
- id, name, description, image, point_cost, claimed_by, status

### ChatHistory
- id, user_id, message, response, timestamp, rating

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

## 🚀 Deployment

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or collaboration:
- Email: lmu-campus-llm@lmu.edu
- Discord: [LMU Campus LLM Community]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for LMU Lions 🦁**
*Making campus life more engaging, social, and spirited through AI-powered student engagement.*
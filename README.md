# 🦁 LMU Campus LLM - Complete Student Engagement Platform

*A comprehensive, AI-powered student engagement platform for LMU, featuring gamified campus participation, real-time events, and a GenZ chatbot assistant.*

## 🌟 **Project Overview**

LMU Campus LLM is a full-stack web application designed to revolutionize campus engagement at Loyola Marymount University. It combines modern web technologies with AI to create an engaging, social platform that encourages student participation in campus life.

### **Key Features**
- 🎮 **Gamified Engagement** - Points, leaderboards, and badges
- 🤖 **AI Chatbot** - GenZ-style campus assistant
- 📅 **Event Management** - RSVP, check-ins, and real-time updates
- 📱 **Mobile-First Design** - Optimized for all devices
- 🗄️ **Database Storage** - Supabase integration for all data
- 📝 **Waitlist System** - Collect student signups with detailed information

## 🏗️ **Architecture Overview**

### **Frontend (React.js)**
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom LMU branding
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Deployment**: Netlify (free tier)

### **Backend (Flask)**
- **Framework**: Python Flask with REST API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Ready for LMU SSO integration
- **Deployment**: Railway (free tier)

### **Database (Supabase)**
- **Tables**: Users, Events, Check-ins, Waitlist, Prizes, Chat History
- **Real-time**: Live updates and notifications
- **Security**: Row Level Security (RLS)
- **Analytics**: Built-in dashboard and queries

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- Python 3.8+
- Git
- Supabase account (free)

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lmu-campus-llm.git
   cd lmu-campus-llm
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Backend (.env file)
   FLASK_ENV=development
   SECRET_KEY=your-dev-secret-key
   SUPABASE_URL=https://mxmgrsofnrnmykwrrsfq.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Frontend (.env file)
   REACT_APP_API_URL=http://localhost:8000
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   python app.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/

## 📁 **Project Structure**

```
lmu-campus-llm/
├── frontend/                    # React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navigation.js   # Main navigation
│   │   │   ├── BuddyChat.js    # AI chatbot interface
│   │   │   ├── WaitlistSignup.js # Waitlist signup modal
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js         # Landing page
│   │   │   ├── Events.js       # Events listing
│   │   │   ├── GameDayZone.js  # Check-in system
│   │   │   ├── Leaderboard.js  # Rankings
│   │   │   ├── Prizes.js       # Point redemption
│   │   │   ├── Profile.js      # User profile
│   │   │   ├── HostZone.js     # Event creation
│   │   │   └── Notifications.js # Notifications
│   │   ├── context/            # State management
│   │   │   └── UserContext.js  # User state
│   │   ├── styles/             # CSS files
│   │   └── App.js              # Main app component
│   ├── package.json            # Dependencies
│   └── build/                  # Production build
├── backend/                    # Flask API
│   ├── app.py                 # Main Flask application
│   ├── database.py            # Supabase integration
│   ├── llama_integration.py   # AI model integration
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Railway deployment
│   ├── runtime.txt           # Python version
│   └── .env.example          # Environment template
├── netlify/                   # Netlify functions
├── docs/                      # Documentation
├── SUPABASE_SETUP.md         # Database setup guide
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
└── README.md                 # This file
```

## 🎨 **Features & Pages**

### **🏠 Home Page**
- Welcome banner with user stats
- Next big event preview
- Daily spirit challenge
- Quick action buttons
- Live event feed

### **📅 Events**
- Card and calendar view
- Event categories (Game Day, Social, Academic, etc.)
- RSVP functionality
- Location mapping
- Social "who's going" info

### **🏈 Game Day Zone**
- QR code check-in
- Geolocation verification
- Live spirit meter
- Photo/video challenge uploads
- Watch party map

### **🏆 Leaderboard**
- Individual and organization rankings
- Badge ribbons and achievements
- Animated position changes
- "How I Rank" modals
- Weekly/monthly competitions

### **🎁 Prizes**
- Point redemption system
- LMU merchandise catalog
- Game day tickets
- Exclusive experiences
- Claim status tracking

### **👤 Profile**
- Personal stats dashboard
- Badge gallery
- Event history
- Achievement timeline
- Settings and preferences

### **🎪 Host Zone**
- Event creation form
- Host dashboard
- Attendance tracking
- Event analytics
- Quick preview mode

### **🤖 GenZ Buddy Chatbot**
- Floating chat button
- Full conversation interface
- GenZ-style responses
- Quick question suggestions
- Response rating system

### **📝 Waitlist System**
- Beautiful signup modal
- Student ID collection
- Comprehensive data gathering
- Interest tracking
- Graduation year tracking

## 🗄️ **Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    student_id VARCHAR(20) UNIQUE,
    avatar TEXT,
    points INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    graduation_year INTEGER,
    major VARCHAR(100),
    organizations TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Waitlist Table**
```sql
CREATE TABLE waitlist (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    student_id VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    graduation_year INTEGER,
    major VARCHAR(100),
    interests TEXT[],
    referral_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending'
);
```

### **Events Table**
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    image TEXT,
    host VARCHAR(255),
    description TEXT,
    max_capacity INTEGER,
    points INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Check-ins Table**
```sql
CREATE TABLE check_ins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    timestamp TIMESTAMP DEFAULT NOW(),
    points_earned INTEGER DEFAULT 0,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8)
);
```

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### **Users**
- `GET /api/users/<id>` - Get user by ID
- `PUT /api/users/<id>` - Update user
- `POST /api/users/<id>/points` - Add points

### **Events**
- `GET /api/events` - List all events
- `GET /api/events/<id>` - Get event details
- `POST /api/events/<id>/rsvp` - RSVP to event
- `POST /api/events/<id>/checkin` - Check in to event

### **Waitlist**
- `POST /api/waitlist` - Join waitlist
- `GET /api/waitlist/count` - Get waitlist count
- `GET /api/waitlist/status` - Check waitlist status

### **Leaderboard**
- `GET /api/leaderboard` - Get rankings
- `GET /api/leaderboard/organizations` - Org rankings

### **Prizes**
- `GET /api/prizes` - List available prizes
- `POST /api/prizes/<id>/claim` - Claim prize

### **Chatbot**
- `POST /api/genz-buddy` - Chat with AI assistant
- `GET /api/llama/status` - Check AI model status

## 🎨 **Design System**

### **Colors**
- **LMU Crimson**: `#8C1515`
- **Navy**: `#1B365D`
- **Gold**: `#D4AF37`
- **Light Gray**: `#F8F9FA`
- **Dark Gray**: `#343A40`

### **Typography**
- **Headings**: Montserrat (Bold)
- **Body**: Inter (Regular)
- **Code**: JetBrains Mono

### **Components**
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Gradient backgrounds, hover effects
- **Forms**: Clean inputs, validation states
- **Navigation**: Bottom nav on mobile, top nav on desktop

## 🚀 **Deployment**

### **Backend (Railway)**
1. Connect GitHub repository
2. Set root directory to `backend`
3. Add environment variables
4. Deploy automatically

### **Frontend (Netlify)**
1. Connect GitHub repository
2. Set base directory to `frontend`
3. Set build command: `npm run build`
4. Set publish directory: `build`

### **Database (Supabase)**
1. Create new project
2. Run SQL schema
3. Configure RLS policies
4. Add environment variables

## 🧪 **Testing**

### **Backend Tests**
```bash
# Test API endpoints
curl http://localhost:8000/
curl http://localhost:8000/api/events
curl -X POST http://localhost:8000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@lmu.edu", "student_id": "12345678"}'
```

### **Frontend Tests**
- ✅ All pages load correctly
- ✅ Navigation works on mobile/desktop
- ✅ Waitlist form validation
- ✅ Chatbot responds
- ✅ Responsive design

### **Database Tests**
- ✅ Waitlist signups save correctly
- ✅ User data persists
- ✅ Event data accessible
- ✅ Analytics queries work

## 📊 **Analytics & Monitoring**

### **Waitlist Analytics**
- Daily signup trends
- Interest breakdown
- Graduation year distribution
- Referral source tracking

### **User Engagement**
- Event attendance rates
- Points earned distribution
- Leaderboard participation
- Chatbot usage patterns

### **Performance Metrics**
- Page load times
- API response times
- Error rates
- User retention

## 🔒 **Security**

### **Data Protection**
- Environment variables for secrets
- CORS configuration
- Input validation
- SQL injection prevention

### **Authentication**
- JWT tokens
- Password hashing
- Session management
- Rate limiting

### **Database Security**
- Row Level Security (RLS)
- Prepared statements
- Connection encryption
- Backup procedures

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 **Support**

- **Documentation**: Check the `/docs` folder
- **Issues**: GitHub Issues
- **Email**: lmu-campus-llm@lmu.edu
- **Discord**: LMU Campus LLM Community

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 **Acknowledgments**

- **LMU Students** - For inspiration and feedback
- **Supabase** - For the amazing database platform
- **React & Flask Communities** - For excellent documentation
- **LMU Administration** - For supporting student innovation

---

**Built with ❤️ for LMU Lions 🦁**

*Making campus life more engaging, social, and spirited through AI-powered student engagement.*

**Version**: 1.0.0  
**Last Updated**: August 2024  
**Status**: Production Ready  
**Cost**: 100% Free
# 🗄️ Supabase Integration Guide

## 📋 Overview

This guide will help you set up Supabase for your LMU Campus LLM application to store all data including the waitlist signups.

## 🎯 What We're Setting Up

- **Database Tables**: Users, Events, Check-ins, Waitlist, Prizes
- **Real-time Data**: All user interactions and waitlist signups
- **Authentication**: User management (optional)
- **Storage**: File uploads for images (optional)

## 🚀 Step 1: Supabase Project Setup

### 1.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `lmu-campus-llm`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
6. Click "Create new project"

### 1.2 Get Your Credentials
Once your project is created, go to **Settings** → **API** and copy:
- **Project URL**: `https://mxmgrsofnrnmykwrrsfq.supabase.co`
- **Anon Key**: Your public API key

## 🗄️ Step 2: Database Schema Setup

### 2.1 Create Tables
Go to **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    points INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
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
    created_at TIMESTAMP DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS check_ins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    timestamp TIMESTAMP DEFAULT NOW(),
    points_earned INTEGER DEFAULT 0
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    graduation_year INTEGER,
    interests TEXT[],
    referral_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending'
);

-- Prizes table
CREATE TABLE IF NOT EXISTS prizes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    point_cost INTEGER NOT NULL,
    claimed_by INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    rating INTEGER
);
```

### 2.2 Set up Row Level Security (RLS)
For the waitlist table, enable RLS and create policies:

```sql
-- Enable RLS on waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist
CREATE POLICY "Allow public waitlist signups" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own waitlist entry
CREATE POLICY "Users can view own waitlist entry" ON waitlist
    FOR SELECT USING (email = current_user);
```

## 🔧 Step 3: Environment Configuration

### 3.1 Backend Environment Variables
Add these to your Railway environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=https://mxmgrsofnrnmykwrrsfq.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.mxmgrsofnrnmykwrrsfq.supabase.co:5432/postgres

# Other Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secret-key
PORT=8000
ALLOWED_ORIGINS=https://your-frontend-domain.netlify.app
```

### 3.2 Frontend Environment Variables
Add these to your Netlify environment variables:

```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_SUPABASE_URL=https://mxmgrsofnrnmykwrrsfq.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🧪 Step 4: Testing the Integration

### 4.1 Test Waitlist Signup
```bash
curl -X POST https://your-backend-url.railway.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@lmu.edu",
    "phone": "(555) 123-4567",
    "graduation_year": 2026,
    "interests": ["Basketball Games", "Greek Life"],
    "referral_source": "website"
  }'
```

### 4.2 Test Waitlist Count
```bash
curl https://your-backend-url.railway.app/api/waitlist/count
```

### 4.3 Check Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Check the `waitlist` table
4. You should see your test entries

## 📊 Step 5: Data Management

### 5.1 View Waitlist Data
In Supabase dashboard:
- **Table Editor** → `waitlist` table
- **SQL Editor** → Run queries like:
  ```sql
  SELECT COUNT(*) FROM waitlist;
  SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 10;
  ```

### 5.2 Export Data
- **Table Editor** → Select table → **Export** → CSV/JSON
- **SQL Editor** → Run export queries

### 5.3 Analytics
Create views for common queries:
```sql
-- Waitlist analytics
CREATE VIEW waitlist_analytics AS
SELECT 
    DATE(created_at) as signup_date,
    COUNT(*) as signups,
    COUNT(CASE WHEN graduation_year IS NOT NULL THEN 1 END) as with_graduation_year
FROM waitlist 
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;
```

## 🔒 Step 6: Security & Best Practices

### 6.1 API Key Security
- ✅ Use **anon key** for public operations (waitlist signups)
- ✅ Use **service key** only for admin operations
- ✅ Never expose service key in frontend code

### 6.2 Data Validation
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Required field validation
- ✅ Duplicate email prevention

### 6.3 Rate Limiting
Consider adding rate limiting to prevent spam:
```python
# In your Flask app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/waitlist', methods=['POST'])
@limiter.limit("5 per minute")
def join_waitlist():
    # Your waitlist logic
```

## 🚀 Step 7: Deployment

### 7.1 Update Backend Dependencies
Make sure these are in your `requirements.txt`:
```
supabase==2.0.0
psycopg2-binary==2.9.7
flask-limiter==3.5.0
```

### 7.2 Deploy to Railway
1. Push your updated code to GitHub
2. Railway will automatically redeploy
3. Add environment variables in Railway dashboard
4. Test the endpoints

### 7.3 Deploy to Netlify
1. Frontend will automatically redeploy
2. Add environment variables in Netlify dashboard
3. Test the waitlist signup form

## 📈 Step 8: Monitoring & Analytics

### 8.1 Supabase Dashboard
- **Logs**: Monitor API requests and errors
- **Database**: Check table growth and performance
- **Auth**: Monitor user signups (if using auth)

### 8.2 Custom Analytics
Create a simple analytics dashboard:
```sql
-- Daily signups
SELECT 
    DATE(created_at) as date,
    COUNT(*) as signups
FROM waitlist 
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Interest breakdown
SELECT 
    unnest(interests) as interest,
    COUNT(*) as count
FROM waitlist 
WHERE interests IS NOT NULL
GROUP BY interest
ORDER BY count DESC;
```

## 🎉 Success!

Your LMU Campus LLM application now has:
- ✅ **Real database storage** for all data
- ✅ **Waitlist signup system** with full tracking
- ✅ **User management** ready for expansion
- ✅ **Event and check-in tracking**
- ✅ **Points and leaderboard system**
- ✅ **Secure API endpoints**

## 📞 Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Verify environment variables are set correctly
3. Test endpoints individually
4. Check database table structure

---

**Built with ❤️ for LMU Lions 🦁**
*Making campus life more engaging, social, and spirited through AI-powered student engagement.*
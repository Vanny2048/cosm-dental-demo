# 🚀 LMU Campus LLM - Complete Deployment Guide

## 📋 Overview

This guide will help you deploy your LMU Campus LLM application completely free using:
- **Frontend**: Netlify (free tier)
- **Backend**: Railway (free tier)
- **Database**: Supabase (free tier)
- **AI Model**: Hugging Face Spaces (free tier)

## 🎯 Prerequisites

1. **GitHub Account** - for code hosting
2. **Netlify Account** - for frontend deployment
3. **Railway Account** - for backend deployment
4. **Supabase Account** - for database (optional)
5. **Hugging Face Account** - for AI model hosting (optional)

## 📦 Step 1: Prepare Your Code

### 1.1 Initialize Git Repository
```bash
# If not already done
git init
git add .
git commit -m "Initial commit - LMU Campus LLM"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Create a new repository named `lmu-campus-llm`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/lmu-campus-llm.git
git push -u origin main
```

## 🚀 Step 2: Deploy Backend to Railway

### 2.1 Connect to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `lmu-campus-llm` repository

### 2.2 Configure Backend
1. Set the **Root Directory** to `backend`
2. Set the **Build Command** to: `pip install -r requirements.txt`
3. Set the **Start Command** to: `gunicorn app:app --bind 0.0.0.0:$PORT`

### 2.3 Environment Variables
Add these environment variables in Railway:
```
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here
PORT=8000
ALLOWED_ORIGINS=https://your-frontend-domain.netlify.app
```

### 2.4 Deploy
1. Click "Deploy Now"
2. Wait for deployment to complete
3. Copy the generated URL (e.g., `https://your-app.railway.app`)

## 🌐 Step 3: Deploy Frontend to Netlify

### 3.1 Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Sign up with your GitHub account
3. Click "New site from Git" → "GitHub"
4. Select your `lmu-campus-llm` repository

### 3.2 Configure Frontend
1. Set **Base directory** to: `frontend`
2. Set **Build command** to: `npm run build`
3. Set **Publish directory** to: `build`

### 3.3 Environment Variables
Add these environment variables in Netlify:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_CHATBOT_URL=https://your-backend-url.railway.app/api/genz-buddy
```

### 3.4 Deploy
1. Click "Deploy site"
2. Wait for deployment to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## 🗄️ Step 4: Database Setup (Optional)

### 4.1 Supabase Setup
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your database URL and API keys
4. Add to Railway environment variables:
```
DATABASE_URL=postgresql://your-supabase-url
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 4.2 Database Schema
Run this SQL in Supabase SQL editor:
```sql
-- Users table
CREATE TABLE users (
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
    created_at TIMESTAMP DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE check_ins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    timestamp TIMESTAMP DEFAULT NOW(),
    points_earned INTEGER DEFAULT 0
);
```

## 🤖 Step 5: AI Model Deployment (Optional)

### 5.1 Hugging Face Spaces
1. Go to [Hugging Face](https://huggingface.co)
2. Create a new Space
3. Choose "Gradio" as the SDK
4. Upload your fine-tuned Llama model
5. Update the model endpoint in your backend

### 5.2 Update Backend
Add to Railway environment variables:
```
LLAMA_MODEL_ENDPOINT=https://your-model.hf.space
LLAMA_API_KEY=your-hf-token
```

## 🔧 Step 6: Testing & Verification

### 6.1 Test Backend
```bash
curl https://your-backend-url.railway.app/
curl https://your-backend-url.railway.app/api/events
curl https://your-backend-url.railway.app/api/genz-buddy \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the best food on campus?"}'
```

### 6.2 Test Frontend
1. Visit your Netlify URL
2. Test all features:
   - Home page loads
   - Events display correctly
   - Chatbot responds
   - Navigation works
   - Mobile responsiveness

## 🔒 Step 7: Security & Optimization

### 7.1 Security Headers
Add to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 7.2 CORS Configuration
Update your backend to only allow your frontend domain:
```python
CORS(app, origins=[os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000')])
```

### 7.3 Environment Variables
Make sure all sensitive data is in environment variables, not in code.

## 📊 Step 8: Monitoring & Analytics

### 8.1 Railway Monitoring
- Check Railway dashboard for logs
- Monitor resource usage
- Set up alerts for downtime

### 8.2 Netlify Analytics
- Enable Netlify Analytics (free tier)
- Monitor page views and performance
- Check for build errors

## 🚨 Troubleshooting

### Common Issues:

1. **Backend not starting**
   - Check Railway logs
   - Verify environment variables
   - Ensure all dependencies are in requirements.txt

2. **Frontend build failing**
   - Check Netlify build logs
   - Verify npm dependencies
   - Check for syntax errors

3. **CORS errors**
   - Verify ALLOWED_ORIGINS in backend
   - Check frontend API URL configuration

4. **Database connection issues**
   - Verify DATABASE_URL format
   - Check Supabase connection settings

## 🎉 Success!

Your LMU Campus LLM application is now deployed and accessible at:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend API**: `https://your-app.railway.app`

## 📞 Support

If you encounter issues:
1. Check the logs in Railway and Netlify
2. Verify all environment variables are set
3. Test endpoints individually
4. Check browser console for frontend errors

---

**Built with ❤️ for LMU Lions 🦁**
*Making campus life more engaging, social, and spirited through AI-powered student engagement.*
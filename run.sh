#!/bin/bash

echo "🚀 Starting LMU Campus LLM on Replit..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd ../frontend
npm install

# Start the backend server
echo "🔧 Starting Flask backend..."
cd ../backend
python app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend
echo "🎨 Starting React frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ LMU Campus LLM is starting up!"
echo "🌐 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo "🤖 Llama Model: Configured for Replit"

# Keep the script running
wait $BACKEND_PID $FRONTEND_PID
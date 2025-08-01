#!/bin/bash

echo "🚀 LMU Campus LLM - Deployment Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_status "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - LMU Campus LLM"
fi

# Check if remote repository exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_warning "No remote repository found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/lmu-campus-llm.git"
    echo "git push -u origin main"
fi

print_status "Building frontend for production..."
cd frontend
npm run build
cd ..

print_status "Testing backend..."
cd backend
source venv/bin/activate
python -c "import app; print('Backend test successful')"
cd ..

print_status "Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy Backend to Railway: https://railway.app"
echo "3. Deploy Frontend to Netlify: https://netlify.com"
echo "4. Set environment variables in deployment platforms"
echo ""
echo "🔗 Quick Deploy Links:"
echo "- Railway: https://railway.app/new/github"
echo "- Netlify: https://app.netlify.com/start"
echo ""
print_status "Deployment script completed successfully!"
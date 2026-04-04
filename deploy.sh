#!/bin/bash

echo "🚀 FinTech Application Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    print_success "Dependencies check passed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."

    cd frotend
    npm install

    if npm run build; then
        print_success "Frontend build completed"
    else
        print_error "Frontend build failed"
        exit 1
    fi

    cd ..
}

# Test backend
test_backend() {
    print_status "Testing backend..."

    cd backend
    npm install

    # Check if MongoDB connection works
    if node -e "
        require('dotenv').config();
        const mongoose = require('mongoose');
        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log('MongoDB connection successful');
                process.exit(0);
            })
            .catch((err) => {
                console.error('MongoDB connection failed:', err.message);
                process.exit(1);
            });
    "; then
        print_success "Backend test passed"
    else
        print_error "Backend test failed"
        exit 1
    fi

    cd ..
}

# Main deployment process
main() {
    echo "Choose deployment option:"
    echo "1. Vercel (Recommended)"
    echo "2. Heroku"
    echo "3. Railway"
    echo "4. Manual deployment"
    read -p "Enter your choice (1-4): " choice

    check_dependencies
    build_frontend
    test_backend

    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_heroku
            ;;
        3)
            deploy_railway
            ;;
        4)
            manual_deployment
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

deploy_vercel() {
    print_status "Deploying to Vercel..."

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi

    # Deploy backend
    print_status "Deploying backend..."
    cd backend
    vercel --prod
    cd ..

    # Deploy frontend
    print_status "Deploying frontend..."
    cd frotend
    vercel --prod
    cd ..

    print_success "Vercel deployment completed!"
    print_warning "Remember to update environment variables in Vercel dashboard"
}

deploy_heroku() {
    print_status "Deploying to Heroku..."

    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI is not installed. Please install it first: https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi

    print_warning "Make sure you have:"
    echo "  - Heroku account"
    echo "  - Heroku app created"
    echo "  - MongoDB Atlas database set up"
    print_warning "Run these commands manually:"
    echo "  heroku create your-app-name"
    echo "  heroku config:set MONGO_URI='your-mongodb-uri'"
    echo "  heroku config:set NODE_ENV='production'"
    echo "  git push heroku main"
}

deploy_railway() {
    print_status "Railway deployment instructions:"

    print_warning "Railway deployment steps:"
    echo "1. Go to https://railway.app"
    echo "2. Connect your GitHub repository"
    echo "3. Add environment variables:"
    echo "   - MONGO_URI"
    echo "   - NODE_ENV=production"
    echo "   - FRONTEND_URL"
    echo "4. Deploy automatically"
}

manual_deployment() {
    print_status "Manual deployment instructions:"

    print_warning "For manual deployment:"
    echo "1. Choose a hosting provider (DigitalOcean, AWS, etc.)"
    echo "2. Set up a VPS or App Platform"
    echo "3. Upload your code via FTP or Git"
    echo "4. Install Node.js and npm on the server"
    echo "5. Set environment variables"
    echo "6. Run 'npm install && npm start' in backend directory"
    echo "7. Serve built frontend files with nginx/apache"
}

# Run main function
main
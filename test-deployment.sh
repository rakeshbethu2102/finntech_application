#!/bin/bash

echo "🧪 FinTech Application - Pre-deployment Tests"
echo "==========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test 1: Check Node.js version
test_nodejs() {
    print_status "Checking Node.js version..."
    if command -v node &> /dev/null; then
        VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$VERSION" -ge 16 ]; then
            print_success "Node.js v$(node --version) - OK"
            return 0
        else
            print_error "Node.js version too old. Need v16+"
            return 1
        fi
    else
        print_error "Node.js not found"
        return 1
    fi
}

# Test 2: Check npm
test_npm() {
    print_status "Checking npm..."
    if command -v npm &> /dev/null; then
        print_success "npm v$(npm --version) - OK"
        return 0
    else
        print_error "npm not found"
        return 1
    fi
}

# Test 3: Check backend dependencies
test_backend_deps() {
    print_status "Checking backend dependencies..."
    cd backend
    if npm list --depth=0 &> /dev/null; then
        print_success "Backend dependencies OK"
        cd ..
        return 0
    else
        print_error "Backend dependencies missing. Run 'npm install' in backend/"
        cd ..
        return 1
    fi
}

# Test 4: Check frontend dependencies
test_frontend_deps() {
    print_status "Checking frontend dependencies..."
    cd frotend
    if npm list --depth=0 &> /dev/null; then
        print_success "Frontend dependencies OK"
        cd ..
        return 0
    else
        print_error "Frontend dependencies missing. Run 'npm install' in frotend/"
        cd ..
        return 1
    fi
}

# Test 5: Check environment files
test_env_files() {
    print_status "Checking environment files..."
    local missing_files=()

    if [ ! -f "backend/.env.production" ]; then
        missing_files+=("backend/.env.production")
    fi

    if [ ! -f "frotend/.env.production" ]; then
        missing_files+=("frotend/.env.production")
    fi

    if [ ${#missing_files[@]} -eq 0 ]; then
        print_success "Environment files present"
        return 0
    else
        print_warning "Missing environment files: ${missing_files[*]}"
        print_warning "Copy from .env.production templates and configure"
        return 1
    fi
}

# Test 6: Check build scripts
test_build_scripts() {
    print_status "Checking build scripts..."

    # Check backend package.json
    if grep -q '"start"' backend/package.json; then
        print_success "Backend start script OK"
    else
        print_error "Backend missing start script"
        return 1
    fi

    # Check frontend build script
    if grep -q '"build"' frotend/package.json; then
        print_success "Frontend build script OK"
    else
        print_error "Frontend missing build script"
        return 1
    fi

    return 0
}

# Test 7: Test MongoDB connection (optional)
test_mongodb() {
    print_status "Testing MongoDB connection..."
    if [ -f "backend/.env.production" ]; then
        cd backend
        if timeout 10s node -e "
            require('dotenv').config({ path: '.env.production' });
            const mongoose = require('mongoose');
            mongoose.connect(process.env.MONGO_URI)
                .then(() => {
                    console.log('MongoDB connection successful');
                    process.exit(0);
                })
                .catch((err) => {
                    console.error('MongoDB connection failed');
                    process.exit(1);
                });
        " 2>/dev/null; then
            print_success "MongoDB connection OK"
            cd ..
            return 0
        else
            print_warning "MongoDB connection test failed - check credentials"
            cd ..
            return 1
        fi
    else
        print_warning "Cannot test MongoDB - .env.production not found"
        return 1
    fi
}

# Run all tests
run_tests() {
    local failed_tests=0

    test_nodejs || ((failed_tests++))
    test_npm || ((failed_tests++))
    test_backend_deps || ((failed_tests++))
    test_frontend_deps || ((failed_tests++))
    test_env_files || ((failed_tests++))
    test_build_scripts || ((failed_tests++))
    test_mongodb

    echo
    if [ $failed_tests -eq 0 ]; then
        print_success "All critical tests passed! Ready for deployment 🚀"
        echo
        echo "Next steps:"
        echo "1. Configure environment variables"
        echo "2. Set up MongoDB Atlas database"
        echo "3. Run ./deploy.sh or follow DEPLOYMENT_README.md"
    else
        print_error "$failed_tests test(s) failed. Please fix before deploying."
        echo
        echo "Common fixes:"
        echo "- Run 'npm install' in both backend/ and frotend/"
        echo "- Copy and configure .env.production files"
        echo "- Ensure Node.js v16+ is installed"
    fi
}

# Main
run_tests
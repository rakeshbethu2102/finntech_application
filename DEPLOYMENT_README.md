# 🚀 FinTech Application - Deployment Guide

A comprehensive guide to deploy your full-stack FinTech application with React frontend and Node.js backend.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (for database)
- GitHub account (for version control)
- Deployment platform account (Vercel, Heroku, Railway, etc.)

## 🏗️ Project Structure

```
fintech_application/
├── backend/          # Node.js/Express API
├── frotend/          # React/Vite frontend
├── deploy.sh         # Deployment script
└── README.md         # This file
```

## 🚀 Quick Deployment (Recommended: Vercel)

### Step 1: Prepare Your Code

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Step 2: Deploy Backend to Vercel

```bash
cd backend
npm install
vercel --prod
```

When prompted:
- Link to existing project or create new: **Create new**
- Project name: `fintech-backend`
- Directory: `./` (current)

### Step 3: Deploy Frontend to Vercel

```bash
cd frotend
npm install
npm run build
vercel --prod
```

When prompted:
- Link to existing project or create new: **Create new**
- Project name: `fintech-frontend`
- Directory: `./` (current)

### Step 4: Configure Environment Variables

#### Backend Environment Variables (Vercel Dashboard):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Frontend Environment Variables (Vercel Dashboard):
```
VITE_API_URL=https://your-backend-domain.vercel.app
```

## 🔧 Alternative Deployment Options

### Option 2: Heroku Deployment

#### Backend Deployment:
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI="your-mongodb-uri"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

#### Frontend Deployment:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frotend
vercel --prod
```

### Option 3: Railway Deployment

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will automatically detect and deploy both frontend and backend
4. Add environment variables in Railway dashboard:
   - `MONGO_URI`
   - `NODE_ENV=production`
   - `FRONTEND_URL`

### Option 4: Manual VPS Deployment

#### Backend Setup:
```bash
# On your VPS
sudo apt update
sudo apt install nodejs npm

# Clone and setup backend
git clone your-repo
cd backend
npm install
npm start
```

#### Frontend Setup:
```bash
# Build frontend
cd frotend
npm install
npm run build

# Serve with nginx
sudo apt install nginx
sudo cp -r dist/* /var/www/html/
```

## 🗄️ Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Create database user
4. Whitelist your IP (0.0.0.0/0 for production)
5. Get connection string
6. Update `MONGO_URI` in environment variables

## 🔒 Security Checklist

- [ ] Environment variables configured
- [ ] MongoDB IP whitelist updated
- [ ] CORS origins configured
- [ ] HTTPS enabled
- [ ] Database credentials secured
- [ ] API endpoints protected

## 🧪 Testing Deployment

### Backend Health Check:
```bash
curl https://your-backend-url/health
# Should return: {"status":"OK","message":"Server is running"}
```

### Frontend Check:
Visit `https://your-frontend-url` in browser

### API Test:
```bash
curl https://your-backend-url/api/dashboard/summary?role=viewer
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs for specific errors

2. **Database Connection:**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist
   - Ensure database user has correct permissions

3. **CORS Errors:**
   - Update `FRONTEND_URL` in backend environment
   - Check CORS configuration in `app.js`

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Restart deployment after changes

## 📊 Performance Optimization

- Enable gzip compression
- Set up CDN for static assets
- Configure database indexing
- Implement caching strategies
- Monitor with application performance tools

## 🔄 Updates and Maintenance

```bash
# Update deployment
git add .
git commit -m "Update deployment"
git push origin main

# For Vercel: automatic redeployment
# For Heroku: git push heroku main
```

## 📞 Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas status
5. Review CORS configuration

## 🎯 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and loading
- [ ] Database connected
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] User authentication working
- [ ] Dashboard loading data
- [ ] All features functional

---

**Happy Deploying! 🚀**

Your FinTech application is now ready for production use.
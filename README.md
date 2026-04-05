# FinTech Application

Full-stack FinTech dashboard with a Node/Express + MongoDB backend and a React + Vite frontend.

## Project Structure

- `backend/` - Express API, MongoDB models, controllers, and Vercel serverless entry
- `frotend/` - React dashboard UI, authentication screens, and user management views
- `deploy.sh` - Deployment helper script
- `DEPLOYMENT_README.md` - Deployment notes
- `USER_MANAGEMENT_GUIDE.md` - User administration guide

## Features

- User authentication with login and registration
- Financial dashboard with income, expense, balance, and category charts
- Transaction creation and listing
- User list and user detail views for analyst/admin roles
- User role and status management for admins
- CORS and deployment support for local and Vercel environments

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on port `5000` by default.

### Frontend

```bash
cd frotend
npm install
npm run dev
```

The frontend runs on port `5173` by default.

## Environment Variables

### Backend

Create `backend/.env` with:

```env
MONGO_URI=your-mongodb-connection-string
FRONTEND_URLS=http://localhost:5173,https://your-frontend-domain.vercel.app
PORT=5000
```

### Frontend

Create `frotend/.env.production` or set the same variable in your deployment platform:

```env
VITE_API_BASE_URL=https://your-backend-api-domain.vercel.app
```

## API Summary

- `GET /` - backend status
- `GET /health` - health check
- `GET /api` - API index
- `POST /api/auth/register` - register a user
- `POST /api/auth/login` - login
- `POST /api/transactions` - create a transaction
- `GET /api/transactions` - list transactions
- `GET /api/dashboard/summary` - dashboard summary
- `GET /api/users` - list users

## Deployment Notes

- Backend is designed to run on Vercel with `backend/api/index.js` as the serverless entry point.
- Frontend API calls should use `VITE_API_BASE_URL`, not a hardcoded localhost URL.
- Backend CORS allows both localhost and the deployed frontend origin when configured through `FRONTEND_URLS`.

## Related Docs

- [backend/README.md](backend/README.md)
- [frotend/README.md](frotend/README.md)
- [DEPLOYMENT_README.md](DEPLOYMENT_README.md)
- [USER_MANAGEMENT_GUIDE.md](USER_MANAGEMENT_GUIDE.md)

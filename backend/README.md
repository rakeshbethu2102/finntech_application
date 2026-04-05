# Backend

Express + MongoDB API for the FinTech application.

## Overview

This backend provides:

- Authentication endpoints for register and login
- Transaction CRUD endpoints
- Dashboard summary endpoint
- User management endpoints for listing, updating, and deleting users
- CORS support for local development and deployed frontend origins

## Tech Stack

- Node.js
- Express 5
- Mongoose
- MongoDB Atlas or any MongoDB-compatible deployment
- dotenv
- cors

## Getting Started

```bash
cd backend
npm install
npm run dev
```

The development server starts on `http://localhost:5000`.

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=your-mongodb-connection-string
FRONTEND_URLS=http://localhost:5173,https://your-frontend-domain.vercel.app
PORT=5000
```

### Notes

- `FRONTEND_URLS` can contain a comma-separated list of allowed origins.
- `FRONTEND_URL` is also supported for compatibility.
- The app connects to MongoDB before starting the local server and also before serving requests in Vercel.

## Available Routes

### Status

- `GET /` - basic backend status
- `GET /health` - health check
- `GET /api` - API index

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Transactions

- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/transactions/:id`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Dashboard

- `GET /api/dashboard/summary?role=viewer|analyst|admin&userId=<id>`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `GET /api/users/:userId/transactions`
- `PUT /api/users/:id/status`
- `PUT /api/users/:id/role`
- `DELETE /api/users/:id`

## Deployment

The Vercel serverless entry point is `backend/api/index.js`.

### Important

- Keep the MongoDB URI in the deployment environment, not in source control.
- Make sure the deployed frontend origin is included in `FRONTEND_URLS`.
- The backend should not be called through `localhost` in production.

## Troubleshooting

- If the API returns `Route not found` at the root URL, use `/` or `/api` to verify the backend instead of calling a missing path.
- If login fails with a CORS error, confirm `FRONTEND_URLS` includes the deployed frontend origin.
- If requests hang or time out, confirm `MONGO_URI` is valid and the database is reachable.

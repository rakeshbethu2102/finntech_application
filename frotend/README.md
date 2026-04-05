# Frontend

React + Vite client for the FinTech application.

## Overview

This frontend provides:

- Login and registration screens
- Financial dashboard with charts and summary cards
- Add transaction flow
- User list, detail, and management screens for analyst/admin roles
- Shared API helper for calling the backend through a configurable base URL

## Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- Recharts
- ESLint

## Getting Started

```bash
cd frotend
npm install
npm run dev
```

The development server runs on `http://localhost:5173`.

## Build

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

## Environment Variables

Set the backend API base URL in `frotend/.env.production` for production deployments:

```env
VITE_API_BASE_URL=https://your-backend-api-domain.vercel.app
```

For local development, the app falls back to `http://localhost:5000` if the variable is not set.

## App Routes

- `/` - login
- `/login` - login
- `/register` - register
- `/dashboard` - dashboard overview
- `/add-transaction` - add transaction form
- `/user-list` - user listing for analyst/admin
- `/user-details/:userId` - user profile and transaction details
- `/user-management` - admin-only user management

## API Usage

All backend requests should go through `src/api.js`, which builds URLs from `VITE_API_BASE_URL`.

Example:

```js
import { apiUrl } from "./api";

fetch(apiUrl("/api/auth/login"), {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(payload),
});
```

## Production Notes

- Do not hardcode `http://localhost:5000` in components.
- Make sure the backend deployment allows the frontend origin through CORS.
- Update Vercel environment variables whenever the backend URL changes.

## Project Structure

- `src/login.jsx` - authentication screen
- `src/register.jsx` - user registration
- `src/dashboard.jsx` - dashboard and charts
- `src/addTransaction.jsx` - transaction creation
- `src/userList.jsx` - user table view
- `src/userDetails.jsx` - user detail and transaction history
- `src/userManagement.jsx` - role/status management
- `src/api.js` - shared API URL helper

## Notes

This app was built from a Vite React template, but the default template README has been replaced with project-specific documentation.

# SB Stocks

SB Stocks is a complete MERN stack stock trading simulator. Users can register, log in, search stocks, view chart history, buy and sell shares with virtual money, review portfolio performance, and track transaction history. Admins can log in separately, view users and transactions, and manage the stock catalog.

## Tech Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, Axios, Recharts, react-hot-toast  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt  
**Architecture:** MVC REST API with protected user and admin routes

## Features

- User register, login, logout, profile update
- Admin login and admin-only dashboard
- JWT authentication and role-based authorization
- Stock list, search, sorting, and stock detail pages
- Dummy historical stock data rendered with Recharts
- Buy and sell stocks using virtual money
- Portfolio holdings with current value and gain/loss
- Transaction history for users and global transaction audit for admins
- Admin add, edit, and delete stocks
- Validation, centralized error handling, loading states, and toast notifications
- Seed script with sample stocks and demo accounts

## Project Structure

```text
SB Stocks/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── docs/
│   └── screenshots/
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd gitdemo
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file from `.env.example` if you want custom settings:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sb_stocks
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed demo stocks and accounts:

```bash
npm run seed
```

Run the backend:

```bash
nodemon index.js
```

You can also run:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| User | demo@sbstocks.com | Demo@123 |
| Admin | admin@sbstocks.com | Admin@123 |

## API Overview

Base URL:

```text
http://localhost:5000/api
```

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin/login`
- `GET /auth/me`
- `POST /auth/logout`

### Stocks

- `GET /stocks`
- `GET /stocks/:id`
- `POST /stocks` admin
- `PUT /stocks/:id` admin
- `DELETE /stocks/:id` admin

### Trading

- `GET /trade/portfolio`
- `GET /trade/transactions`
- `GET /trade/orders`
- `POST /trade/buy`
- `POST /trade/sell`

### Users and Dashboard

- `GET /dashboard`
- `GET /dashboard/admin` admin
- `GET /users/profile`
- `PUT /users/profile`
- `GET /users` admin
- `GET /users/transactions` admin

## Screenshot Placeholders

Add screenshots to `docs/screenshots/` before publishing the repository.

| Screen | Placeholder |
| --- | --- |
| User Dashboard | `docs/screenshots/user-dashboard.png` |
| Stock Details | `docs/screenshots/stock-details.png` |
| Portfolio | `docs/screenshots/portfolio.png` |
| Admin Dashboard | `docs/screenshots/admin-dashboard.png` |
| Admin Stock Manager | `docs/screenshots/admin-stocks.png` |

## Git Push Checklist

```bash
git status
git add .
git commit -m "Build SB Stocks MERN trading simulator"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

## Verification

The project was checked with:

```bash
cd frontend && npm run build
cd backend && npm audit --omit=dev
```

The frontend build passes. Backend npm audit reports zero production vulnerabilities.

# 📈 Stock Market Trading Web Application

A **full-stack stock market trading web application** built using the **MERN stack**, designed to simulate real-world trading features such as order placement, portfolio tracking, and profit & loss (PnL) calculation.

This project focuses on **backend logic, secure authentication, real-time calculations, and clean frontend architecture**, making it suitable for learning and portfolio demonstration.

---

## 🚀 Live Demo
Frontend: stockmarketpapertradefrontend.vercel.app
  
Backend: stockmarketpapertrade.vercel.app


---

## 🧰 Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB (Mongoose)

### Authentication
- JWT (JSON Web Tokens)

### Deployment
- Vercel

---

## ✨ Features

### 👤 User Features
- User authentication (Signup / Login)
- Secure session handling with JWT
- Place **Buy / Sell trades**
- View open & closed trades
- Real-time **PnL (Profit & Loss) calculation**
- Portfolio balance tracking
- Trade history

---

### ⚙️ Trading Logic
- Market & limit order support
- Quantity and price validation
- Buy/Sell execution logic
- Accurate PnL calculation
- User balance updates after every trade

---

## 🔐 Security
- JWT-based authentication
- Protected API routes
- User-specific trade isolation
- Secure environment variable usage

---

## 📂 Project Structure
```bash
Stock-Trading-App/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── assets/
│ └── package.json
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/stock-trading-app.git
cd stock-trading-app
```
### 2️⃣ Install dependencies
Frontend
```bash
cd frontend
npm install
npm run dev
```
Backend
```bash
cd backend
npm install
npm start
```
---
## 🔑 Environment Variables

### Create a .env file in the backend directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
---
## 📊 Key Learnings from This Project

Trade execution logic
Accurate PnL calculations
Backend validation & error handling
Secure authentication flow
API design for financial applications
Real-world state management in React
---
## 👨‍💻 Developer

Abhinay Singh
MERN Stack Full-Stack Developer

Email: sabhinay@gmail.com

GitHub: https://github.com/abhiwasgoodbut



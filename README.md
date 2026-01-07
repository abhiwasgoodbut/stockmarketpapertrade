📈 Stock Market Paper Trading Web Application

A full-stack stock market paper trading web application built using the MERN stack, designed to simulate real-world trading workflows such as placing trades, tracking positions, and calculating profit & loss (P&L).

This project emphasizes backend logic, REST API design, authentication, and financial calculations, making it a strong demonstration of real-world full-stack development skills.

🚀 Live Demo

Frontend: https://stockmarketpapertradefrontend.vercel.app

Backend: Not publicly exposed

🧰 Tech Stack
Frontend

React.js

JavaScript (ES6+)

HTML5, CSS3

Axios

Backend

Node.js

Express.js

REST APIs

Database

MongoDB

Mongoose

Authentication

JWT (JSON Web Tokens)

Deployment

Vercel (Frontend)

✨ Features
👤 User Features

User registration and login

JWT-based authentication

Secure protected routes

Account and profile management

📊 Trading Features

Place BUY and SELL paper trades

Quantity and price validation

Open and closed trade tracking

Accurate per-trade P&L calculation

Complete trade history

⚙️ Backend Logic

Server-side validation of trade data

Centralized trade and P&L calculation logic

Robust error handling

Scalable REST API architecture

🔐 Security

JWT authentication

Protected API routes

Secure environment variables

Server-side input validation

📂 Project Structure
Stock-Market-Paper-Trading/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── README.md

⚙️ Installation & Setup
Clone the repository
git clone https://github.com/yourusername/stock-market-paper-trading.git
cd stock-market-paper-trading

Frontend setup
cd frontend
npm install
npm run dev

Backend setup
cd backend
npm install
npm start

Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

📌 Key Highlights

Realistic paper trading workflow

Accurate profit & loss calculations

Clean REST API design

Backend-focused implementation

Practical financial application logic

👨‍💻 Developer

Abhinay Singh
Full-Stack MERN Developer

Email: sabhinay@gmail.com

GitHub: https://github.com/abhiwasgoodbut

# 🛒 Full-Stack eCommerce Platform (React + FastAPI)

This is a **full-stack eCommerce web application** that includes:
- A modern customer-facing frontend for browsing and purchasing products
- A secure admin panel for managing products, categories, offers, and orders
- Role-based authentication (Admin vs Customer)
- Real-time updates with FastAPI + React
- Clean UI built with Tailwind CSS and Vite
- SQLite database by default (switchable to PostgreSQL for production)


✨ Features

✅ Customer Side:
- Browse all products with categories, offers, and discounts
- View product details and special offers
- Responsive, mobile-friendly design
- User login and signup
- View and track order history

✅ Admin Side:
- Login with admin role
- Full CRUD (Create, Read, Update, Delete) for:
  → Products
  → Categories
  → Offers
  → Orders
- Role-based restriction (only admins can modify data)
- Live updates reflected in frontend instantly

✅ Backend:
- FastAPI for blazing-fast APIs
- SQLAlchemy ORM with models for all entities
- Automatic Swagger API docs at /docs
- JWT / session-based authentication with hashed passwords

====================================================================
🚀 Run Locally (No Docker Needed)
====================================================================

1. Clone the Repository
git clone https://github.com/AmanTShekar/E_commerce-site.git
cd react-fastapi-ecommerce

2. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at: http://127.0.0.1:8000
Swagger docs: http://127.0.0.1:8000/docs

3. Frontend Setup
cd ../frontend
npm install

👉 Edit frontend/src/config.js to point API to backend:
export const BASE_URL = "http://127.0.0.1:8000";

Run frontend:
npm run dev

Frontend runs at: http://localhost:5173

====================================================================
🔑 Sample Users
====================================================================

Admin Login:
username: admin@123
password: admin123

Customer Login:
username: john@1
password: john123

====================================================================
📂 Project Structure
====================================================================

react-fastapi-ecommerce/
├─ backend/
│  ├─ main.py           # FastAPI entry point
│  ├─ models.py         # SQLAlchemy models
│  ├─ routes/           # API routes (products, users, orders, etc.)
│  └─ requirements.txt  # Backend dependencies
├─ frontend/
│  ├─ src/              # React components & pages
│  ├─ public/           # Static assets
│  ├─ package.json      # Frontend dependencies
│  └─ vite.config.js    # Vite config
├─ ecommerce.db         # SQLite database (auto-created)
├─ .gitignore
├─ .gitattributes
└─ README.md

====================================================================
⚡ Optional: Docker (for full container setup)
====================================================================

docker-compose up --build

This runs both backend (FastAPI) and frontend (React) in containers.

====================================================================
📊 Tech Stack
====================================================================

Frontend: React, Vite, Tailwind CSS  
Backend: FastAPI, SQLAlchemy, Uvicorn, Pydantic  
Database: SQLite (default) or PostgreSQL (production ready)  
Authentication: JWT/session-based, password hashing  

====================================================================
🛠️ Development Notes
====================================================================

- Default database: SQLite (file-based, easy for local dev)
- To switch to PostgreSQL, update backend database URL in main.py or config
- Use `.env` files for secrets in production (API keys, DB passwords, JWT keys)
- Product images can be served from `/public` or integrated with S3/Cloudinary
- React frontend uses Axios to talk to backend API

====================================================================
🎯 Roadmap / Future Enhancements
====================================================================

- Payment gateway integration (Stripe / PayPal)
- Email notifications for order confirmations
- Cloud storage integration for product images
- Search and filter products by name, category, or price
- Admin analytics dashboard (sales, users, popular products)
- Wishlist and cart functionality
- Multi-language and multi-currency support

====================================================================
🧪 Testing
====================================================================

- Backend API can be tested with Swagger UI (http://127.0.0.1:8000/docs)
- Frontend tested with `npm run dev` using live backend
- Unit tests can be added with pytest (backend) and Jest (frontend)

====================================================================
📢 Notes
====================================================================

- Docker is optional, not required for local dev
- Recommended Python 3.10+ and Node.js 18+
- Works on Windows, macOS, and Linux

# 🛒 Full-Stack eCommerce Platform (React + FastAPI)

A complete eCommerce web application with:
- Customer-facing frontend (browse products, view offers, manage account, track orders)
- Admin panel (manage products, categories, offers, and orders with full CRUD)
- Role-based authentication (Admin / Customer)
- Modern responsive UI with React + Tailwind CSS
- FastAPI backend with SQLAlchemy ORM and automatic API docs

## ✨ Features

### 👤 Customer
- Browse products with categories and offers
- See discounts and special deals
- Authentication (signup/login)
- View personal order history
- Responsive mobile-first UI

### 🛠️ Admin
- Secure login for admins only
- CRUD for products, categories, offers, orders
- Role-based restrictions (only admin can modify)
- Live updates reflected instantly

### ⚡ Backend
- FastAPI high-performance API
- SQLAlchemy ORM
- JWT/session authentication
- Password hashing
- Swagger docs at /docs

## 🚀 Run Locally (No Docker Required)

1. Clone repository
git clone https://github.com/AmanTShekar/E_commerce-site.git
cd react-fastapi-ecommerce

2. Setup backend
cd backend
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload
Backend runs at: http://127.0.0.1:8000
Swagger docs: http://127.0.0.1:8000/docs

3. Setup frontend
cd ../frontend
npm install
Edit frontend/src/config.js:
export const BASE_URL = "http://127.0.0.1:8000";
npm run dev
Frontend runs at: http://localhost:5173

## 🔑 Sample Users (for testing)

Admin:
username: admin@123
password: admin123

Customer:
username: john@1
password: john123

## 📂 Project Structure

react-fastapi-ecommerce/
├─ backend/
│  ├─ main.py
│  ├─ models.py
│  ├─ routes/
│  ├─ database.py
│  ├─ auth.py
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ package.json
│  └─ vite.config.js
├─ ecommerce.db
├─ .gitignore
└─ README.md

## ⚙️ Example .env Files

Backend (.env):
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./ecommerce.db
# DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

Frontend (.env):
VITE_API_BASE_URL=http://127.0.0.1:8000

## ⚡ Optional: Run with Docker

docker-compose up --build
(Starts backend + frontend automatically in containers)

## 📊 Tech Stack

Frontend: React, Vite, Tailwind CSS
Backend: FastAPI, SQLAlchemy, Uvicorn, Pydantic
Database: SQLite (local) / PostgreSQL (production-ready)
Authentication: JWT/session + password hashing

## 🛠️ Development Notes

- Default DB: SQLite (file-based)
- Switch to PostgreSQL by updating DATABASE_URL in backend .env
- Use .env files for secrets (JWT, DB credentials, etc.)
- Product images in frontend/public or cloud storage
- API testable at http://127.0.0.1:8000/docs

## 🎯 Roadmap / Future Improvements

- Payment integration (Stripe / PayPal)
- Email notifications for orders
- Cloud storage for product images
- Advanced search + filtering
- Analytics dashboard for admin
- Wishlist & shopping cart
- Multi-language and multi-currency

## 🧪 Testing

Backend:
pytest

Frontend:
npm run test

Manual API testing via Swagger UI:
http://127.0.0.1:8000/docs

## 🐳 Optional Docker-Compose Example

version: '3.9'
services:
  backend:
    build: ./backend
    container_name: ecommerce-backend
    env_file:
      - ./backend/.env
    ports:
      - "8000:8000"
  frontend:
    build: ./frontend
    container_name: ecommerce-frontend
    env_file:
      - ./frontend/.env
    ports:
      - "5173:5173"

# 🛒 Full-Stack eCommerce Platform (React + FastAPI)

This is a full-stack eCommerce application with a Customer-Facing Frontend and Admin Panel, built using modern web technologies for fast, scalable, and maintainable development.

Frontend: React + Tailwind CSS + Vite  
Backend: FastAPI + SQLAlchemy + SQLite/PostgreSQL (configurable)  
Authentication: Role-based (Admin / Customer)  
Database: SQLAlchemy ORM models for Products, Categories, Offers, Orders, and Users  
API Documentation: Automatic Swagger UI via FastAPI

## 🌐 Live Demo

You can try the fully deployed eCommerce platform at the following link:  

[**Visit Live Demo**](https://your-deployed-site-url.com) 

## ✨ Features

Admin Panel:  
- Full CRUD support for Products, Categories, Offers, and Orders  
- Manage product details including categories, offers, and images  
- Role-based access: Only Admin can perform modifications  
- Real-time updates reflected in frontend  
- Order management and tracking

Frontend (Customer-Facing):  
- Browse products with images, categories, offers, and pricing  
- View active offers in a clean card layout  
- Featured categories and product highlights  
- User authentication and order history view  
- Responsive and modern UI powered by Tailwind CSS

Backend:  
- FastAPI for high-performance API endpoints  
- SQLAlchemy ORM for structured database management  
- Products API returns nested objects for category and offer instead of IDs  
- Role-based authentication with hashed passwords  
- API documentation available at /docs

## ⚡ New Updates
- Migrated backend from json-server to FastAPI + SQLAlchemy  
- Products now correctly show Category names and Offer details  
- Full CRUD support for all entities  
- Frontend consumes live data from backend at http://localhost:8000  
- Added JWT or session-based authentication for secure user roles  
- Admin Panel updated for real-time item management

## 📂 Project Structure

react-fastapi-ecommerce/  
├─ backend/               # FastAPI backend  
│  ├─ main.py             # Entry point  
│  ├─ models.py           # SQLAlchemy models  
│  ├─ routes/             # API routes  
│  └─ requirements.txt    # Python dependencies  
├─ frontend/              # React frontend  
│  ├─ src/                # Components, pages, utils  
│  ├─ public/             # Static assets  
│  ├─ package.json  
│  └─ vite.config.js  
├─ .gitignore  
├─ .gitattributes  
├─ ecommerce.db           # SQLite database (optional)  
└─ README.md


## 🚀 Getting Started

### 1. Clone the Repository
git clone https://github.com/YourUsername/react-fastapi-ecommerce.git
cd react-fastapi-ecommerce

### 2. Create a Virtual Environment (Optional but Recommended)
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows

### 3. Install Backend Dependencies
cd backend
pip install -r requirements.txt

### 4. Setup Environment Variables
Create a `.env` file in the backend directory:

FLASK_SECRET_KEY=your_secret_key
SCRAPER_API_KEY=your_scraperapi_key
GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json

- `google-credentials.json` → Download from Google Cloud Console and place in the project root.  
- `SCRAPER_API_KEY` → [Get a free ScraperAPI key](https://www.scraperapi.com/).  

### 5. Run Backend Locally
uvicorn main:app --reload
- Backend runs at: http://127.0.0.1:8000  
- API docs: http://127.0.0.1:8000/docs

### 6. Setup Frontend
cd ../frontend
npm install
npm run dev
- Frontend runs at: http://localhost:5173  
- Make sure Axios or BASE_URL points to the FastAPI backend

### 7. Sample Users
Admin:
{
  "username": "admin@123",
  "password": "admin123"
}

Customer:
{
  "username": "john@1",
  "password": "john123"
}

## 💡 Additional Notes

- Ensure database configuration is correct for PostgreSQL/MySQL if not using SQLite  
- Newly added items in Admin Panel can be edited or deleted  
- Role-based access ensures Admin-only operations are secure  
- Use .env for sensitive keys and credentials

## 🚀 Technologies Used

- Frontend: React, Vite, Tailwind CSS  
- Backend: FastAPI, SQLAlchemy, Uvicorn, Pydantic  
- Database: SQLite or PostgreSQL  
- Authentication: JWT / session-based, password hashing

## 🎯 Roadmap / Future Improvements

- Payment gateway integration (Stripe / PayPal)  
- Email notifications for orders  
- Product image upload via AWS S3 or Cloudinary  
- Improved analytics dashboard for Admin

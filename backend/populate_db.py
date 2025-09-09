import json
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import User, Category, Product, Offer
from auth import hash_password

# Load products JSON
with open("products.json", "r") as f:
    products_data = json.load(f)

Base.metadata.create_all(bind=engine)
db: Session = SessionLocal()

# Users
users = [
    {"username": "admin@123", "password": "admin123", "role": "admin"},
    {"username": "john@1", "password": "john123", "role": "user"}
]
for u in users:
    if not db.query(User).filter(User.username == u["username"]).first():
        db.add(User(username=u["username"], password=hash_password(u["password"]), role=u["role"]))

# Categories
category_names = set([p["category"] for p in products_data])
category_map = {}
for name in category_names:
    cat = db.query(Category).filter(Category.name == name).first()
    if not cat:
        cat = Category(name=name)
        db.add(cat)
        db.commit()
    category_map[name] = cat.id

# Products
for p in products_data:
    exists = db.query(Product).filter(Product.title == p["title"]).first()
    if not exists:
        db.add(Product(
            title=p["title"],
            price=p["price"],
            description=p["description"],
            image=p["image"],
            category_id=category_map[p["category"]]
        ))

# Offers
offers = [{"title": "50% Off", "discount": 50}, {"title": "20% Off Electronics", "discount": 20}]
for o in offers:
    if not db.query(Offer).filter(Offer.title == o["title"]).first():
        db.add(Offer(title=o["title"], discount=o["discount"]))

db.commit()
db.close()
print("Database populated successfully!")

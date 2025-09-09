from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import User, Category, Product, Offer
from auth import hash_password

from database import Base, engine

# Drop all existing tables
Base.metadata.drop_all(bind=engine)

# Recreate tables according to current models
Base.metadata.create_all(bind=engine)


# Start session
db = SessionLocal()

# -----------------------------
# Users
# -----------------------------
users_data = [
    {"username": "admin@123", "password": "admin123", "role": "admin"},
    {"username": "john@1", "password": "john123", "role": "user"}
]

for u in users_data:
    user = User(username=u["username"], password=hash_password(u["password"]), role=u["role"])
    db.add(user)

# -----------------------------
# Categories
# -----------------------------
categories_data = [
    "Clothing", "Electronics", "Wearables", "Smart Home", 
    "Audio", "Gaming", "Accessories"
]

categories = {}
for name in categories_data:
    cat = Category(name=name)
    db.add(cat)
    db.flush()  # Get ID immediately
    categories[name] = cat.id

# -----------------------------
# Offers
# -----------------------------
offers_data = [
    {"title": "50% Off", "discount": 50},
    {"title": "30% Off", "discount": 30},
]

offers = {}
for o in offers_data:
    offer = Offer(title=o["title"], discount=o["discount"])
    db.add(offer)
    db.flush()
    offers[o["title"]] = offer.id

# -----------------------------
# Products
# -----------------------------
products_data = [
    # Electronics
    {
        "title": "Smartphone Max 12",
        "price": 999,
        "description": "A powerful smartphone with advanced features and a sleek design.",
        "category": "Electronics",
        "image": "https://cdn.pixabay.com/photo/2017/01/22/19/20/smartphone-2001018_960_720.jpg"
    },
    {
        "title": "Laptop Pro 15",
        "price": 1299,
        "description": "A high-performance laptop suitable for work and entertainment.",
        "category": "Electronics",
        "image": "https://cdn.pixabay.com/photo/2014/09/27/13/44/macbook-463491_960_720.jpg"
    },
    # Wearables
    {
        "title": "Fitness Tracker Pro",
        "price": 199,
        "description": "Track your health and fitness metrics 24/7 with precision.",
        "category": "Wearables",
        "image": "https://cdn.pixabay.com/photo/2019/06/26/14/03/smartwatch-4302209_960_720.jpg"
    },
    {
        "title": "Smartwatch Alpha",
        "price": 299,
        "description": "Stylish smartwatch with fitness and call features.",
        "category": "Wearables",
        "image": "https://cdn.pixabay.com/photo/2016/11/29/03/53/apple-1867461_960_720.jpg"
    },
    # Smart Home
    {
        "title": "Smart Thermostat",
        "price": 249,
        "description": "Automate your home temperature and save energy with smart features.",
        "category": "Smart Home",
        "image": "https://cdn.pixabay.com/photo/2018/03/16/18/44/thermostat-3234088_960_720.jpg"
    },
    {
        "title": "Smart Speaker",
        "price": 149,
        "description": "Voice-activated speaker with smart assistant integration.",
        "category": "Smart Home",
        "image": "https://cdn.pixabay.com/photo/2018/12/03/20/08/technology-3856071_960_720.jpg"
    },
    # Audio
    {
        "title": "Wireless Earbuds",
        "price": 129,
        "description": "Compact and high-quality wireless earbuds for music on the go.",
        "category": "Audio",
        "image": "https://cdn.pixabay.com/photo/2018/04/13/19/07/headphones-3312586_960_720.jpg"
    },
    # Gaming (expanded to 5)
    {
        "title": "Gaming Console Z",
        "price": 499,
        "description": "Next-gen gaming console with stunning graphics and performance.",
        "category": "Gaming",
        "image": "https://cdn.pixabay.com/photo/2016/11/29/04/17/xbox-1867288_960_720.jpg"
    },
    {
        "title": "Gaming Headset X",
        "price": 89,
        "description": "Immersive sound and noise cancellation for intense gaming.",
        "category": "Gaming",
        "image": "https://cdn.pixabay.com/photo/2017/02/14/00/14/headphones-2067336_960_720.jpg"
    },
    {
        "title": "Gaming Keyboard K1",
        "price": 59,
        "description": "Mechanical keyboard with RGB lighting and fast response.",
        "category": "Gaming",
        "image": "https://cdn.pixabay.com/photo/2014/05/02/21/49/keyboard-336166_960_720.jpg"
    },
    {
        "title": "Gaming Mouse M9",
        "price": 49,
        "description": "Ergonomic gaming mouse with adjustable DPI.",
        "category": "Gaming",
        "image": "https://cdn.pixabay.com/photo/2017/01/06/19/15/mouse-1956622_960_720.jpg"
    },
    {
        "title": "VR Headset V2",
        "price": 399,
        "description": "Experience virtual reality gaming with high-definition visuals.",
        "category": "Gaming",
        "image": "https://cdn.pixabay.com/photo/2016/11/29/04/35/virtual-reality-1867628_960_720.jpg"
    },
    # Accessories (expanded to 5)
    {
        "title": "Wireless Mouse",
        "price": 39,
        "description": "Ergonomic wireless mouse with high precision tracking.",
        "category": "Accessories",
        "image": "https://cdn.pixabay.com/photo/2018/01/08/18/57/technology-3068612_960_720.jpg"
    },
    {
        "title": "USB-C Hub",
        "price": 49,
        "description": "Expand your laptop connectivity with multiple ports.",
        "category": "Accessories",
        "image": "https://cdn.pixabay.com/photo/2017/08/10/03/36/usb-2611090_960_720.jpg"
    },
    {
        "title": "Laptop Sleeve",
        "price": 25,
        "description": "Protect your laptop with a stylish sleeve.",
        "category": "Accessories",
        "image": "https://cdn.pixabay.com/photo/2016/11/29/04/22/laptop-1867446_960_720.jpg"
    },
    {
        "title": "Portable Charger",
        "price": 35,
        "description": "High-capacity power bank for charging on the go.",
        "category": "Accessories",
        "image": "https://cdn.pixabay.com/photo/2016/11/29/03/34/powerbank-1867390_960_720.jpg"
    },
    {
        "title": "Bluetooth Speaker",
        "price": 59,
        "description": "Portable speaker with excellent sound quality.",
        "category": "Accessories",
        "image": "https://cdn.pixabay.com/photo/2017/05/10/16/47/speaker-2300463_960_720.jpg"
    }
]

# Add products
for p in products_data:
    prod = Product(
        title=p["title"],
        price=p["price"],
        description=p["description"],
        image=p["image"],
        category_id=categories[p["category"]],
        offer_id=None  # default no offer
    )
    db.add(prod)

# Commit everything
db.commit()
db.close()

print("Database wiped and fully seeded with users, categories, offers, and products!")

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from models import User, Product, Offer, Category, Order
from schemas import (
    UserCreate, UserOut,
    ProductBase, ProductOut,
    OfferBase, OfferOut,    # ✅ Add these
    CategoryBase, CategoryOut,
    OrderBase, OrderOut
)
from auth import hash_password, verify_password

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------- AUTH --------
@app.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username exists")
    hashed = hash_password(user.password)
    new_user = User(username=user.username, password=hashed, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"username": db_user.username, "role": db_user.role}

# -------- CATEGORIES --------
@app.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@app.post("/categories", response_model=CategoryOut)
def create_category(category: CategoryBase, db: Session = Depends(get_db)):
    new_cat = Category(name=category.name)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@app.put("/categories/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, category: CategoryBase, db: Session = Depends(get_db)):
    db_cat = db.query(Category).filter(Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db_cat.name = category.name
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_cat = db.query(Category).filter(Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"detail": "Category deleted"}

# -------- OFFERS --------
@app.get("/offers", response_model=list[OfferOut])
def get_offers(db: Session = Depends(get_db)):
    return db.query(Offer).all()

@app.post("/offers", response_model=OfferOut)
def create_offer(offer: OfferBase, db: Session = Depends(get_db)):
    new_offer = Offer(title=offer.title, discount=offer.discount)
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    return new_offer

@app.put("/offers/{offer_id}", response_model=OfferOut)
def update_offer(offer_id: int, offer: OfferBase, db: Session = Depends(get_db)):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    db_offer.title = offer.title
    db_offer.discount = offer.discount
    db.commit()
    db.refresh(db_offer)
    return db_offer

@app.delete("/offers/{offer_id}")
def delete_offer(offer_id: int, db: Session = Depends(get_db)):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    db.delete(db_offer)
    db.commit()
    return {"detail": "Offer deleted"}

# -------- PRODUCTS --------
@app.get("/products", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [
        ProductOut(
            id=p.id,
            title=p.title,
            price=p.price,
            description=p.description,
            image=p.image,
            category=p.category,   # pass the relationship object
            offer=p.offer          # pass offer relationship (or None)
        )
        for p in products
    ]



@app.post("/products", response_model=ProductOut)
def create_product(product: ProductBase, db: Session = Depends(get_db)):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return ProductOut(
        id=new_product.id,
        title=new_product.title,
        price=new_product.price,
        description=new_product.description,
        image=new_product.image,
        category=new_product.category,  # relationship object
        offer=new_product.offer         # relationship object
    )

@app.put("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product: ProductBase, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return ProductOut(
        id=db_product.id,
        title=db_product.title,
        price=db_product.price,
        description=db_product.description,
        image=db_product.image,
        category_id=db_product.category_id,
        offer_id=db_product.offer_id,
        category=db_product.category.name if db_product.category else None
    )

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"detail": "Product deleted"}

# -------- ORDERS --------
@app.get("/orders", response_model=list[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@app.post("/orders", response_model=OrderOut)
def create_order(order: OrderBase, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    new_order = Order(**order.dict())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@app.patch("/orders/{order_id}", response_model=OrderOut)
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = status
    db.commit()
    db.refresh(db_order)
    return db_order

@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(db_order)
    db.commit()
    return {"detail": "Order deleted"}

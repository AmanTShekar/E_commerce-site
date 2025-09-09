from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  # ✅ just import Base, no Session or engine

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="user")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

class Offer(Base):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    discount = Column(Float)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    price = Column(Float)
    description = Column(String)
    image = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=True)

    category = relationship("Category")
    offer = relationship("Offer")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    user = Column(String)
    status = Column(String, default="Pending")

    product = relationship("Product")

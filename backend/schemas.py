from pydantic import BaseModel

# === USER SCHEMAS ===
class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True  # Pydantic v2

# === CATEGORY SCHEMAS ===
class CategoryBase(BaseModel):
    name: str

class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# === OFFER SCHEMAS ===
class OfferBase(BaseModel):
    title: str
    discount: float

class OfferOut(OfferBase):
    id: int

    class Config:
        from_attributes = True

# === PRODUCT SCHEMAS ===
class ProductBase(BaseModel):
    title: str
    price: float
    description: str | None = None
    image: str | None = None
    category_id: int
    offer_id: int | None = None

# === PRODUCT SCHEMAS ===
from pydantic import BaseModel
from typing import Optional

class ProductOut(BaseModel):
    id: int
    title: str
    price: float
    description: str
    image: str
    category: CategoryOut         # Nested category
    offer: Optional[OfferOut] = None  # Nested offer

    class Config:
        from_attributes = True


# === ORDER SCHEMAS ===
class OrderBase(BaseModel):
    product_id: int
    quantity: int
    user: str
    status: str

class OrderOut(OrderBase):
    id: int

    class Config:
        from_attributes = True

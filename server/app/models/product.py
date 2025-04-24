from app import db
from datetime import datetime, timezone
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    brand = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Double, nullable=False)
    household_qty = db.Column(db.Double, nullable=False)
    household_qty_threshold = db.Column(db.Double, nullable=False)
    qty_type = db.Column(db.String(255), nullable=False)
    purchase_qty = db.Column(db.Double, nullable=False)
    image = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.String(255), nullable=False)
    purchase_location = db.Column(db.String(255), nullable=False)
    location_id = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self): 
        return {
            "id": self.id,
            "productName": self.product_name,
            "description": self.description,
            "brand": self.brand,
            "price": self.price,
            "householdQty": self.household_qty,
            "qtyType": self.qty_type,
            "purchaseQty": self.purchase_qty,
            "householdQtyThreshold": self.household_qty_threshold,
            "image": self.image,
            "productId": self.product_id,
            "purchaseLocation": self.purchase_location,
            "locationId": self.location_id,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "userId": self.user_id
        }
    
    @hybrid_property
    def is_below_threshold(self):
        if self.purchase_qty == 0:
            return False
        return (self.household_qty / self.purchase_qty) <= self.household_qty_threshold
    
    @is_below_threshold.expression
    def is_below_threshold(cls):
        return (cls.household_qty / cls.purchase_qty) <= cls.household_qty_threshold
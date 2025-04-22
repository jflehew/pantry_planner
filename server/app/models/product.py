from flask import jsonify
from app import db
from datetime import datetime, timezone

class Product(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Collumn(db.String(255), nullable=False)
    description = db.Collumn(db.String(255), nullable=False)
    brand = db.Collumn(db.String(255), nullable=False)
    price = db.Collumn(db.Double, nullable=False)
    household_qty = db.Collumn(db.Integer, nullable=False)
    qty_type = db.Collumn(db.String(255), nullable=False)
    purchase_qty = db.Collumn(db.Integer, nullable=False)
    image = db.Collumn(db.String(255), nullable=False)
    product_id = db.Collumn(db.String(255), nullable=False)
    purchase_location = db.Collumn(db.String(255), nullable=False)
    location_id = db.Collumn(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return{
            "id": self.id,
            "product_name": self.product_name,
            "description": self.description,
            "brand": self.brand,
            "price": self.price,
            "household_qty": self.household_qty,
            "qty_type": self.qty_type,
            "purchase_qty": self.purchase_qty,
            "image": self.image,
            "product_id": self.product_id,
            "purchase_location": self.purchase_location,
            "location_id": self.location_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "user_id": self.user_id
        }
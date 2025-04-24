from typing import Type
from sqlalchemy import select
from app.models.product import Product
from app import db

def validate_product(data):
    errors = {}
    if len(data['productName']) < 1 or len(data['productName']) > 255:
        errors['productName'] = "Your name for the product must be between 1 and 255 characters long"
    if len(data['description']) < 1 or len(data['description']) > 255:
        errors['description'] = "The product description must be between 1 and 255 characters"
    if len(data['brand']) < 1 or len(data['brand']) > 255:
        errors['brand'] = "The brand name must be between 1 and 255 characters long"
    try:
        value = float(data['price'])
        if value < 0:
            errors['price'] = "The product price cannot be negative"
    except (TypeError, ValueError):
        errors['price'] = "The product price must be a number"
    try:
        value = float(data['householdQty'])
        if value < 0:
            errors['householdQty'] = "Your household quantity cannot be negative"
    except (TypeError, ValueError):
        errors['householdQty'] = "Your household quantity must be a number"
    try:
        value = float(data['householdQtyThreshold'])
        if value < 0:
            errors['householdQtyThreshold'] = "Your household quantity threshold cannot be negative"
    except (TypeError, ValueError):
        errors['householdQtyThreshold'] = "Your household quantity threshold must be a number"
    if len(data['qtyType']) < 1 or len(data['qtyType']) > 255:
        errors['qtyType'] = "The quantity type must be between 1 and 255 characters long"
    try:
        value = float(data['purchaseQty'])
        if value < 0:
            errors['purchaseQty'] = "purchase quantity cannot be negative"
    except (TypeError, ValueError):
        errors['purchaseQty'] = "Your purchase quantity must be a number"
    if data['image'].strip() is None or len(data['image']) > 255:
        errors['image'] = "image URL must be 255 characters or less"
    if data['productId'] is None or len(data['productId']) > 255:
        errors['productId'] = "product Id must be 255 characters or less"
    if len(data['purchaseLocation']) < 1 or len(data['purchaseLocation']) > 255:
        errors['purchaseLocation'] = "Your purchase location must be between 1 and 255 characters long"
    if data['locationId'] is None or len(data['locationId']) > 255:
        errors['locationId'] = "Location Id must be 255 characters or less"
    return errors
    
    
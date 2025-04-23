from sqlalchemy import select
from flask import Blueprint, request, jsonify, session
from app.models.product import Product
from app import db
#import utils when added. (validations and such)

product_bp = Blueprint('product_bp', __name__, url_prefix='/api/products')

@product_bp.route('/create', methods=['POST'])
def create_product():
    data = request.get_json()
    new_product = Product(
        product_name=data['productName'],
        description=data['description'],
        brand=data['brand'],
        price=data['price'],
        household_qty=data['householdQty'],
        household_qty_threshold=data['householdQtyThreshold'],
        qty_type=data['qtyType'],
        purchase_qty=data['purchaseQty'],
        image=data['image'],
        product_id=data['productId'],
        purchase_location=data['purchaseLocation'],
        location_id = data['locationId'],
        user_id=data['userId']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

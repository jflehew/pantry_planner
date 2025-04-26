from email import message
from sqlalchemy import delete, select
from flask import Blueprint, request, jsonify, session
from app.models.product import Product
from app import db
from app.utils.product_utils import validate_product

product_bp = Blueprint('product_bp', __name__, url_prefix='/api/products')

@product_bp.route('/create', methods=['POST'])
def create_product():
    data = request.get_json()
    errors = validate_product(data)
    if errors:
        print("i'm in errors?")
        return jsonify(errors), 400
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

@product_bp.route('/get/all', methods=['GET'])
def get_user_products():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User is not logged in"}), 401
    result = db.session.execute(select(Product).where(Product.user_id == user_id))
    products = result.scalars().all()
    return jsonify([product.to_dict() for product in products]), 200

@product_bp.route('/delete', methods=['DELETE'])
def delete_product():
    data = request.get_json()
    product_id = data.get("id")
    if not product_id:
        return jsonify({'message': 'Missing produc ID'})
    db.session.execute(delete(Product).where(Product.id == product_id))
    db.session.commit()
    return jsonify({'message': "Product Deleted"}), 200

@product_bp.route('/get/one', methods=['GET'])
def get_one_product():
    product_id = request.args.get('id')
    print(product_id)
    if not product_id:
        return jsonify({'message': 'Missing produc ID'})
    result = db.session.execute(select(Product).where(Product.id == product_id))
    print(result)
    product = result.scalar_one_or_none()
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    print(product)
    return jsonify(product.to_dict())

@product_bp.route('/update', methods=['POST'])
def update_product():
    data = request.get_json()
    product = db.session.get(Product, data["id"])
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    product.product_name = data['productName']
    product.description = data['description']
    product.brand = data['brand']
    product.price = data['price']
    product.household_qty = data['householdQty']
    product.household_qty_threshold = data['householdQtyThreshold']
    product.qty_type = data['qtyType']
    product.purchase_qty = data['purchaseQty']
    product.image = data['image']
    product.product_id = data['productId']
    product.purchase_location = data['purchaseLocation']
    product.location_id = data['locationId']
    product.user_id = data['userId']

    db.session.commit()
    return jsonify(product.to_dict()), 200

@product_bp.route('/update/qty', methods=['POST'])
def update_household_qty():
    data = request.get_json()
    product = db.session.get(Product, data['id'])
    try:
        value = float(data['householdQty'])
        if value < 0:
            return {"message" : "Your household quantity cannot be negative"}, 400
    except (TypeError, ValueError):
        return {"message" : "Your household quantity must be a number"}, 400
    if not product:
        return jsonify({'message': 'product not found'}), 404
    
    product.household_qty = data['householdQty']

    db.session.commit()
    return jsonify(product.to_dict()), 200



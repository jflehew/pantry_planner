from sqlalchemy import delete, select
from flask import Blueprint, request, jsonify, session
from app.models.product import Product
from app.models.gorcery_list import GroceryList
from app import db

grocery_list_bp = Blueprint('grocery_list_bp', __name__, url_prefix='/api/grocerylist')

@grocery_list_bp.route('/add/threshold', methods=['POST'])
def add_to_grocery_list():
    current_user = session.get('user_id')
    if not current_user:
        return jsonify({'message': 'user not found'}), 404
    products = Product.query.filter_by(user_id = current_user).all()
    for product in products:
        if product.is_below_threshold:
            exists = GroceryList.query.filter_by(
                user_id = current_user,
                product_id=product.id
            ).first()

            if not exists:
                db.session.add(
                    GroceryList(
                        user_id=current_user,
                        product_id=product.id,
                        product_purchased=True
                    )
                )
    db.session.commit()
    return jsonify({'message': 'products succesufully added'}), 200

@grocery_list_bp.route('/get/list', methods=['GET'])
def get_grocery_list():
    current_user = session.get('user_id')
    if not current_user:
        return jsonify({'message': 'user not found'}), 404
    grocery_list = GroceryList.query.filter_by(user_id = current_user).all()
    return jsonify([{
        "id": item.id,
        "productPurchased": item.product_purchased,
        "product": item.product.to_dict()
    }
    for item in grocery_list
    ]), 200

@grocery_list_bp.route('/update/purchase', methods=['POST'])
def update_item_purchase():
    list_id = request.get_json()
    grocery_item = db.session.get(GroceryList, list_id)
    if not grocery_item:
        return {'message': "product not found"}, 404
    grocery_item.product_purchased = not grocery_item.product_purchased
    db.session.commit()
    return {'message': 'item succesfully updated'}, 200

@grocery_list_bp.route('/add/one', methods=['POST'])
def add_one_item():
    product_id = request.get_json()
    current_user = session.get('user_id')
    print('product id:', product_id)
    print('user id:', current_user)
    if product_id is None or current_user is None:
        return {'message': 'either product or user not found'}, 404
    db.session.add(GroceryList(
        user_id=current_user,
        product_id=product_id,
        product_purchased=True
    ))
    db.session.commit()
    return {'message': 'grocery list sucessfully updated'}, 200

@grocery_list_bp.route('/delete', methods=['POST'])
def delete_grocery_list():
    current_user = session.get('user_id')
    if current_user is None:
        return {'message': 'user not found'}
    grocery_list = GroceryList.query.filter_by(user_id = current_user).all()
    for item in grocery_list:
        if item.product_purchased:
            product = Product.query.get(item.product_id)
            if product:
                product.household_qty += product.purchase_qty
            db.session.delete(item)
        elif not item.product_purchased:
            item.product_purchased = True
    db.session.commit()
    return {'message': "grocery list successfully updated"}, 200
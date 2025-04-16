from flask import Blueprint, request, jsonify, session
from app.models.user import User
from app import db, bcrypt
from flask_bcrypt import Bcrypt

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/users')

@user_bp.route('', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('', methods=['POST'])
def create_users():
    data = request.get_json()
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=hashed_pw
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201
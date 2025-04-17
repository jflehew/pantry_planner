from sqlalchemy import select
from flask import Blueprint, request, jsonify, session
from app.models.user import User
from app import db, bcrypt
from flask_bcrypt import Bcrypt

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/users')

@user_bp.route('/login', methods=['POST'])
def get_user_by_email():
    # print(request.get_json())
    print("get request was called")
    data = request.get_json()
    fetched_user = db.session.execute(select(User).where(User.email == data['email'])).fetchone()
    user = fetched_user[0] if fetched_user else None
    if user and bcrypt.check_password_hash(user.password, data['password']):
            session['user_id'] = user.id
            return User.get_basic_user_info(user)
    return jsonify({'error': 'Invalid credentials'}), 401

@user_bp.route('/register', methods=['POST'])
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
    session['user_id'] = new_user.id
    return new_user.get_basic_user_info()

@user_bp.route('/authenticate', methods=['GET'])
def authenticate_user():
    if not session.get('user_id'):
        return jsonify({'error': "You are not logged in"}), 401
    user = User.query.get(session.get('user_id'))
    return User.get_basic_user_info(user)

@user_bp.route('/logout', methods=['GET'])
def logout_user():
    session.clear()
    return {'message': "you have successfully logged out"}, 200
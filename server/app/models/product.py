from flask import jsonify
from app import db
from datetime import datetime, timezone

class Product(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
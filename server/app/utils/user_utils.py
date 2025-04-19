import re
from sqlalchemy import select
from app.models.user import User
from app import db


EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
PASSWORD_REGEX = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$')

def format_name(name):
    return " ".join(part.capitalize() for part in name.strip().split())
def normalize_email(email):
    return email.strip().lower()

def validate_user(data):
    errors = {}
    if len(data['firstName']) < 1 or len(data['firstName']) > 255:
        errors['firstName'] = "FirstName must be between 1 and 255 characters"
    if len(data['lastName']) < 1 or len(data['lastName']) > 255:
        errors['lastName'] = "lastName must be between 1 and 255 characters"
    if not EMAIL_REGEX.match(data['email']):
        errors['email'] = "Invalid email forma"
    if db.session.execute(
        select(User).where(User.email == data['email'])
        ).fetchone():
        errors['email'] = "Email already exisits, please login"
    if not PASSWORD_REGEX.match(data['password']):
        errors['password'] = "password must be greater than 8 characters and contain a lowercase letter, uppercase letter, number, and symbol"
    if not data['password'] == data['confirmPassword']:
        errors['confirmPassword'] = "Confirmed password must be the same as your password"
    return errors
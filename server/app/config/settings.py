import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY")

    if os.getenv("FLASK_ENV") == "production":
        SESSION_COOKIE_SAMESITE = "Lax"
        SESSION_COOKIE_SECURE = True
    else:
        SESSION_COOKIE_SAMESITE = "None"
        SESSION_COOKIE_SECURE = False
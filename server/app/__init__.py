from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_cors import CORS
import os
from flask_bcrypt import Bcrypt
from flask_session import Session


bcrypt = Bcrypt()
load_dotenv()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.settings.Config")
    CORS(
        app, 
        origins=["http://localhost:5173"], 
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        )
    

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    Session(app)

    from app.models import user
    from app.controllers.user_controller import user_bp
    app.register_blueprint(user_bp)
    from app.controllers.kroger_controller import kroger_bp
    app.register_blueprint(kroger_bp)

    return app

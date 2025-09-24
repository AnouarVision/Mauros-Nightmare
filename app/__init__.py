import os
from flask import Flask
from dotenv import load_dotenv
from .db import init_db

load_dotenv()


def create_app():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    templates_path = os.path.join(base_dir, "..", "templates")
    static_folder = os.path.join(base_dir, "..", "static")

    app = Flask(
        __name__,
        template_folder=templates_path,
        static_folder=static_folder
    )

    app.secret_key = os.getenv("SECRET_KEY")
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['DEBUG'] = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    # Inizializza il DB
    init_db(app)

    return app

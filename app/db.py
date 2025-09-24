import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()


def init_db(app):
    from .models import User

    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD")
    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    port = int(os.getenv("MYSQL_PORT", 3306))
    database = os.getenv("MYSQL_DATABASE")

    app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username="mauro").first():
            password_hash = "scrypt:32768:8:1$BS0nruqtK9yhMoAY$64927c9cda3932b5f261a7bb76e768f4942d38ce980b7ec477cf8634e590476a529c2e7d732ed95d925b249f427ea438e34726d91d6182f6d57369c5aa3086c1"
            mauro = User(username="mauro", password=password_hash)
            db.session.add(mauro)
            db.session.commit()

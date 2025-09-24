import hashlib
from .db import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)  # abbastanza lungo per scrypt

    def check_password(self, password):
        if self.password.startswith("scrypt:"):
            try:
                params, salt_hex, key_hex = self.password.split("$")
                _, N, r, p = params.split(":")
                N, r, p = int(N), int(r), int(p)
                salt = bytes.fromhex(salt_hex)
                key = bytes.fromhex(key_hex)
                test_key = hashlib.scrypt(password.encode(), salt=salt, n=N, r=r, p=p)
                return test_key == key
            except Exception:
                return False
        else:
            from werkzeug.security import check_password_hash
            return check_password_hash(self.password, password)

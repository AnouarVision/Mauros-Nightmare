from flask import Flask, render_template, request, session, make_response
from dotenv import load_dotenv
from flask_wtf import CSRFProtect
import time
import os

from app import create_app
from app.db import db
from werkzeug.security import check_password_hash
from sqlalchemy import text

load_dotenv()
app = create_app()
FLAG = os.getenv("FLAG")
csrf = CSRFProtect(app)


@app.after_request
def add_headers(response):
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "img-src 'self'; "
        "font-src 'self' https://fonts.gstatic.com; "
        "connect-src 'self'; "
        "media-src 'self'; "
        "frame-ancestors 'none'; "
    )
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/game")
def game():
    return render_template("game.html")


@app.route("/secret", methods=['GET', 'POST'])
def secret():
    if 'start_time' not in session:
        session['start_time'] = time.time()

    if time.time() - session['start_time'] > 300:
        session.clear()
        return render_template("secret_login.html", timeout=True)

    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')

        sql = f"SELECT * FROM users WHERE username = '{username}'"
        try:
            result = db.session.execute(text(sql)).fetchone()
        except Exception:
            result = None

        if result:
            user_id, user_name, password_hash = result
            if check_password_hash(password_hash, password):
                return render_template("flag.html", flag=FLAG)
            else:
                return render_template("secret_login.html", error="Invalid credentials")

        return render_template("secret_login.html", error="Invalid credentials")

    return render_template("secret_login.html")


@app.errorhandler(429)
def ratelimit_handler(e):
    response = make_response(
        render_template("secret_login.html", error="Too many requests. Please wait 10 seconds before retrying.")
    )
    response.status_code = 429
    return response


@app.route("/game_over")
def game_over():
    return render_template("game_over.html")


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", debug=debug_mode)

from flask import Flask, render_template, request, abort, session, make_response
from dotenv import load_dotenv
from flask_wtf import CSRFProtect
import time
import os

load_dotenv()

app = Flask(__name__)
FLAG = os.getenv("FLAG")
SECRET_PASSWORD = os.getenv("SECRET_PASSWORD")
app.secret_key = os.getenv("SECRET_KEY")
app.config['SESSION_COOKIE_HTTPONLY'] = True
debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
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
    
    elapsed = time.time() - session['start_time']
    if elapsed > 300:
        session.clear()
        return render_template("secret_login.html", timeout=True)
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        if username == 'mauro' and password == SECRET_PASSWORD:
            return render_template("flag.html", flag=FLAG)
        
        if username == 'mauro':
            for i, char in enumerate(password):
                if i < len(SECRET_PASSWORD) and char == SECRET_PASSWORD[i]:
                    time.sleep(5)
                    return render_template("secret_login.html", delay=True)
        
        return render_template("secret_login.html", error="Invalid credentials")
    
    return render_template("secret_login.html")
    
@app.errorhandler(429)
def ratelimit_handler(e):
    response = make_response(render_template("secret_login.html", error="Too many requests. Please wait 10 seconds before retrying."))
    response.status_code = 429
    return response
    
@app.route('/game_over')
def game_over():
    return render_template('game_over.html')
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=debug_mode)

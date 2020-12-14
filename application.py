import os

from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///sign_language.db")

@app.route("/")
# @login_required
def index():
    return render_template("index.html")

@app.route("/vowels", methods=["GET", "POST"])
# @login_required
def vowels():
    if request.method == "GET":
        vowels = db.execute("SELECT * FROM signs WHERE type = ?",'vowel')

    return render_template("vowels.html", vowels=vowels)


@app.route("/consonants")
# @login_required
def consonants():
    if request.method == "GET":
        consonants = db.execute("SELECT * FROM signs WHERE type = ?",'consonant')

    return render_template("consonants.html", consonants=consonants)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username",
                          username=request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quiz", methods=["GET", "POST"])
@login_required
def quiz():
    if request.method == "GET":
        user = db.execute("SELECT username, score FROM users where id = ?", session["user_id"])[0]
        user['nickname'] = user['username'].split('@')[0]
    return render_template("quiz.html", user=user)

@app.route("/questions", methods=["GET"])
@login_required
def questions():
    if request.method == "GET":
        a = request.args.get('a', 0, type=int)
        options = [
            [["m"], "This sign is?", ["vowel", "H", "M", "T"], "M"],
            [["a"], "This sign is?", ["G", "Y", "A", "I"], "A"],
            [["g", "i"], "This signs are?", ["M and N", "not any", "consonant and vowel", "I and G"], "consonant and vowel"],
            [["j"], "This sign is?", ["W", "K", "Z", "J"], "J"],
            [["p", "q"], "This signs are?", ["not any", "H and I", "U and O", "O and U"], "not any"],
            [["u"], "This sign is?", ["A", "U", "O", "consonant"], "U"],
            [["e", "i"], "This signs are?", ["vowels", "consonant", "E and F", "H and I"], "vowels"],
            [["r"], "This sign is?", ["N", "B", "D", "R"], "R"],
            [["u"], "This sign is?", ["not any", "V", "S", "Q"], "not any"],
            [["t", "u"], "This signs are?", ["vowels", "consonant", "A and B", "T and U"], "T and U"],
            [["e"], "This sign is?", ["X", "P", "vowel", "T"], "vowel"],
            [["h", "i"], "This signs are?", ["vowel and consonant", "H and I", "U and O", "O and U"], "H and I"],
        ]
    return jsonify(result=options) 


@app.route("/save_score", methods=["POST"])
@login_required
def save_score():
    if request.method == "POST":
        new_score = request.form.get("score")
        score = db.execute("SELECT score FROM users where id = ?", session["user_id"])[0]['score']
        if int(new_score) >= int(score):
            row = db.execute("UPDATE users SET score = ? WHERE id = ?", new_score, session["user_id"])
            message = 'Congratulations your highest score is ' + str(new_score) + '! <a href="/">Go Home</a>'
        else:
            message = 'Good job! your highest score is still ' + str(score) + '<a href="/quiz">Try again</a>'
        # flash(message)

    return message


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        password1 = request.form.get("password1")
        status = True
        # Ensure username was registered
        if not username:
            return apology("missing username", 400)

        # Ensure password was registered
        elif not password:
            return apology("missing password", 400)

        # check password confirmation
        elif not password1 and not password == password1:
            status = False
            return apology("passwords don't match", 400)


        # check unique username
        exists_username = db.execute("SELECT username FROM users where username = ?", username)
        if exists_username:
            status = False
            return apology("unavailable user", 400)

        # register
        if status:
            register = db.execute("INSERT INTO users (username, hash) VALUES(?, ?)", username, generate_password_hash(password))
            # Remember which user has logged in
            session["user_id"] = register
            # Redirect user to home page
            return redirect("/")
    else:
        return render_template("register.html")


@app.route("/practice", methods=["GET", "POST"])
@login_required
def practice():
    return render_template("practice.html")


def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)

if __name__ == "__main__":
    app.run()

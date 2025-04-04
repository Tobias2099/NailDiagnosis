from flask import Blueprint, request, redirect, jsonify
from oauthlib.oauth2 import WebApplicationClient
from werkzeug.security import generate_password_hash
from urllib.parse import urlencode
import requests, os
from db import get_db_connection

facebook_oauth_bp = Blueprint('facebook_oauth', __name__)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Load secrets
FACEBOOK_CLIENT_ID = os.getenv('FACEBOOK_CLIENT_ID')
FACEBOOK_CLIENT_SECRET = os.getenv('FACEBOOK_CLIENT_SECRET')
FACEBOOK_AUTHORIZATION_ENDPOINT = "https://www.facebook.com/v19.0/dialog/oauth"
FACEBOOK_TOKEN_ENDPOINT = "https://graph.facebook.com/v19.0/oauth/access_token"
FACEBOOK_USERINFO_ENDPOINT = "https://graph.facebook.com/me?fields=id,name,email,picture"

client = WebApplicationClient(FACEBOOK_CLIENT_ID)

@facebook_oauth_bp.route("/login")
def login():
    request_uri = client.prepare_request_uri(
        FACEBOOK_AUTHORIZATION_ENDPOINT,
        redirect_uri=request.base_url.replace("login", "callback"),
        scope=["email", "public_profile"]
    )
    return redirect(request_uri)

@facebook_oauth_bp.route("/callback")
def callback():
    code = request.args.get("code")

    token_url, headers, body = client.prepare_token_request(
        FACEBOOK_TOKEN_ENDPOINT,
        redirect_url=request.base_url,
        code=code,
        client_id=FACEBOOK_CLIENT_ID,
        client_secret=FACEBOOK_CLIENT_SECRET
    )

    token_response = requests.post(token_url, headers=headers, data=body)
    client.parse_request_body_response(token_response.text)

    # Fetch user info
    uri, headers, body = client.add_token(FACEBOOK_USERINFO_ENDPOINT)
    userinfo_response = requests.get(uri, headers=headers, data=body)
    userinfo = userinfo_response.json()

    users_email = userinfo.get("email", "").lower()
    users_name = userinfo.get("name", "")
    picture = userinfo.get("picture", {}).get("data", {}).get("url", "")

    if not users_email:
        return "Email not available from Facebook", 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (users_email,))
    user = cursor.fetchone()

    if not user:
        dummy_password = generate_password_hash("facebook_oauth_user")
        cursor.execute("""
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
        """, (users_name, users_email, dummy_password))
        db.commit()

        # Re-fetch user after insert
        cursor.execute("SELECT * FROM users WHERE email = %s", (users_email,))
        user = cursor.fetchone()

    cursor.close()
    db.close()

    # Send user info to frontend
    params = urlencode({
        "username": user["username"],
        "email": user["email"],
        "birthDate": user.get("date_of_birth") or "",
        "sex": user.get("sex") or "",
        "height": user.get("height") or "",
        "weight": user.get("weight") or "",
        "medicalHistory": user.get("medical_history") or "",
        "picture": picture
    })

    return redirect(f"http://localhost:3000/profile?{params}")

from flask import Blueprint, request, redirect, jsonify, url_for
from oauthlib.oauth2 import WebApplicationClient
from werkzeug.security import generate_password_hash
import requests, os
from db import get_db_connection
from urllib.parse import urlencode

oauth_bp = Blueprint('google_oauth', __name__)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Load secrets
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

client = WebApplicationClient(GOOGLE_CLIENT_ID)

# Fetch Google provider config
def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@oauth_bp.route("/login")
def login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg['authorization_endpoint']

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url.replace('login', 'callback'),
        scope=['openid', 'email', 'profile'],
    )
    return redirect(request_uri)

@oauth_bp.route("/callback")
def callback():
    code = request.args.get("code")
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg['token_endpoint']

    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )

    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    )

    client.parse_request_body_response(token_response.text)

    userinfo_endpoint = google_provider_cfg['userinfo_endpoint']
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    if userinfo_response.json().get('email_verified'):
        users_email = userinfo_response.json()['email'].lower()
        users_name = userinfo_response.json()['name']
        picture = userinfo_response.json()['picture']

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (users_email,))
        user = cursor.fetchone()

        # Insert if user doesn't exist
        if not user:
            dummy_password = generate_password_hash("google_oauth_user")
            cursor.execute("""
                INSERT INTO users (username, email, password_hash)
                VALUES (%s, %s, %s)
            """, (users_name, users_email, dummy_password))
            db.commit()

            # Fetch the inserted user
            cursor.execute("SELECT * FROM users WHERE email = %s", (users_email,))
            user = cursor.fetchone()

        cursor.close()
        db.close()

        # Now send full user info to frontend
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

        return redirect(f'http://localhost:3000/profile?{params}')
    else:
        return "User email not available or not verified by Google", 400
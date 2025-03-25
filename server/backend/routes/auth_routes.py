from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.users import User
from backend.database import db
import re

auth_bp = Blueprint('auth', __name__)
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$')
PASSWORD_MIN_LENGTH = 12


def validate_password(password):
    """Enforce strong password policy"""
    errors = []
    if len(password) < PASSWORD_MIN_LENGTH:
        errors.append(f"Minimum {PASSWORD_MIN_LENGTH} characters")
    if not re.search(r"[A-Z]", password):
        errors.append("At least 1 uppercase letter")
    if not re.search(r"[a-z]", password):
        errors.append("At least 1 lowercase letter")
    if not re.search(r"\d", password):
        errors.append("At least 1 number")
    if not re.search(r"[!@#$%^&*()_+=-]", password):
        errors.append("At least 1 special character")
    return errors


@auth_bp.route('/register', methods=['POST'])
def register():
    """Secure user registration with admin validation"""
    try:
        data = request.json
        required = ['username', 'email', 'password']

        # Validate required fields
        if not all(key in data for key in required):
            return jsonify(error="Missing required fields: username, email, password"), 400

        # Sanitize inputs
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password'].strip()
        user_type = data.get('user_type', 'client').strip().lower()

        # Admin creation security
        if user_type == 'admin':
            if 'user_type' not in session or session.get('user_type') != 'admin':
                return jsonify(error="Admin privileges required to create admin users"), 403

        # Validate email format
        if not EMAIL_REGEX.match(email):
            return jsonify(error="Invalid email format"), 400

        # Validate password strength
        pass_errors = validate_password(password)
        if pass_errors:
            return jsonify(error="Password requirements: " + ", ".join(pass_errors)), 400

        # Check existing users
        if User.query.filter((User.username == username) | (User.email == email)).first():
            return jsonify(error="Username or email already exists"), 409

        # Create user
        new_user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
            user_type=user_type if user_type in ['admin', 'client'] else 'client'
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify(message=f"User {username} registered successfully"), 201

    except Exception as e:
        db.session.rollback()
        return jsonify(error="Registration failed: " + str(e)), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Secure login with session management"""
    try:
        data = request.json
        if not all(key in data for key in ['username', 'password']):
            return jsonify(error="Username and password required"), 400

        user = User.query.filter_by(username=data['username'].strip()).first()

        # Prevent timing attacks with constant-time comparison
        if not user or not check_password_hash(user.password_hash, data['password'].strip()):
            return jsonify(error="Invalid username or password"), 401

        # Regenerate session ID on login
        session.clear()
        session.permanent = True
        session['user_id'] = user.id
        session['user_type'] = user.user_type
        session['username'] = user.username

        return jsonify(
            message=f"Welcome back {user.username}",
            user_type=user.user_type,
            email=user.email
        ), 200

    except Exception as e:
        return jsonify(error="Login failed: " + str(e)), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Secure logout with session cleanup"""
    try:
        # Clear all session data
        session.clear()
        # Add security headers
        response = jsonify(message="Logged out successfully")
        response.headers['Cache-Control'] = 'no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        return response, 200
    except Exception as e:
        return jsonify(error="Logout failed: " + str(e)), 500

@auth_bp.route('/check', methods=['GET'])
def check_auth():
    if 'user_type' in session and session['user_type'] == 'admin':
        user = User.query.get(session['user_id'])
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type
        }), 200
    return jsonify({'error': 'Unauthorized'}), 401
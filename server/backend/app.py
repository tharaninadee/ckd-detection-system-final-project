from flask import Flask, jsonify, request, session
from flask_cors import CORS
from backend.config import Config
from backend.database import db, mail
from backend.routes.auth_routes import auth_bp
from backend.routes.client_routes import client_bp
from backend.routes.admin_routes import admin_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)  # Enable CORS for all routes

    db.init_app(app)
    mail.init_app(app)

    # Add test endpoint
    @app.route('/')
    def home():

        return jsonify({
            "message": "Kidney Care AI - CKD Detection and Management System",
            "version": "1.0",
        }), 200

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')

    @app.before_request
    def check_admin_access():
        if request.path.startswith('/admin'):
            if 'user_type' not in session or session['user_type'] != 'admin':
                return jsonify({'message': 'Unauthorized'}), 403

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Create database tables
    print("Starting CKD Detection and Management Server...")
    app.run(debug=True)

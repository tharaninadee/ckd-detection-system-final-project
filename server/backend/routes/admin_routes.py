from flask import Blueprint, request, jsonify, session
from backend.database import db, mail
from backend.models.users import User
from backend.models.inquiries import Inquiry
from backend.models.general_info import GeneralInfo
from backend.models.recommendations import Recommendation
from backend.models.detection_result import DetectionResult
from flask_mail import Message

admin_bp = Blueprint('admin', __name__)


# ====================== USER MANAGEMENT ======================
@admin_bp.route('/users', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        users = User.query.all()
        return jsonify([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type
        } for user in users]), 200

    elif request.method == 'POST':
        data = request.json
        try:
            new_user = User(
                username=data['username'],
                email=data['email'],
                password_hash=data['password'],  # Remember to hash in real application
                user_type=data.get('user_type', 'client')
            )
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'User created successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400


@admin_bp.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_user(user_id):
    user = User.query.get_or_404(user_id)

    if request.method == 'GET':
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type
        }), 200

    elif request.method == 'PUT':
        data = request.json
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.user_type = data.get('user_type', user.user_type)
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200

    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200


# ====================== INQUIRY MANAGEMENT ======================
@admin_bp.route('/inquiries', methods=['GET'])
def get_inquiries():
    inquiries = Inquiry.query.all()
    return jsonify([{
        'id': inquiry.id,
        'user_id': inquiry.user_id,
        'message': inquiry.message,
        'response': inquiry.response,
        'created_at': inquiry.created_at
    } for inquiry in inquiries]), 200


@admin_bp.route('/inquiries/<int:inquiry_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_inquiry(inquiry_id):
    inquiry = Inquiry.query.get_or_404(inquiry_id)

    if request.method == 'GET':
        return jsonify({
            'id': inquiry.id,
            'user_id': inquiry.user_id,
            'message': inquiry.message,
            'response': inquiry.response,
            'created_at': inquiry.created_at
        }), 200

    elif request.method == 'PUT':
        data = request.json
        inquiry.message = data.get('message', inquiry.message)
        inquiry.response = data.get('response', inquiry.response)
        db.session.commit()
        return jsonify({'message': 'Inquiry updated successfully'}), 200

    elif request.method == 'DELETE':
        db.session.delete(inquiry)
        db.session.commit()
        return jsonify({'message': 'Inquiry deleted successfully'}), 200


# ====================== GENERAL INFO MANAGEMENT ======================
@admin_bp.route('/general-info', methods=['GET', 'POST'])
def general_info():
    if request.method == 'GET':
        info = GeneralInfo.query.all()
        return jsonify([{
            'id': item.id,
            'title': item.title,
            'content': item.content
        } for item in info]), 200

    elif request.method == 'POST':
        data = request.json
        new_info = GeneralInfo(
            title=data['title'],
            content=data['content']
        )
        db.session.add(new_info)
        db.session.commit()
        return jsonify({'message': 'Info added successfully'}), 201


@admin_bp.route('/general-info/<int:info_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_general_info(info_id):
    info = GeneralInfo.query.get_or_404(info_id)

    if request.method == 'GET':
        return jsonify({
            'id': info.id,
            'title': info.title,
            'content': info.content
        }), 200

    elif request.method == 'PUT':
        data = request.json
        info.title = data.get('title', info.title)
        info.content = data.get('content', info.content)
        db.session.commit()
        return jsonify({'message': 'Info updated successfully'}), 200

    elif request.method == 'DELETE':
        db.session.delete(info)
        db.session.commit()
        return jsonify({'message': 'Info deleted successfully'}), 200


# ====================== RECOMMENDATION MANAGEMENT ======================
@admin_bp.route('/recommendations', methods=['GET', 'POST'])
def recommendations():
    if request.method == 'GET':
        recommendations = Recommendation.query.all()
        return jsonify([{
            'id': rec.id,
            'stage': rec.stage,
            'egfr_range_low': rec.egfr_range_low,
            'egfr_range_high': rec.egfr_range_high,
            'lifestyle_advice': rec.lifestyle_advice,
            'food_advice': rec.food_advice,
            'medical_advice': rec.medical_advice
        } for rec in recommendations]), 200

    elif request.method == 'POST':
        data = request.json
        new_rec = Recommendation(**data)
        db.session.add(new_rec)
        db.session.commit()
        return jsonify({'message': 'Recommendation added successfully'}), 201


@admin_bp.route('/recommendations/<int:rec_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_recommendation(rec_id):
    rec = Recommendation.query.get_or_404(rec_id)

    if request.method == 'GET':
        return jsonify({
            'id': rec.id,
            'stage': rec.stage,
            'egfr_range_low': rec.egfr_range_low,
            'egfr_range_high': rec.egfr_range_high,
            'lifestyle_advice': rec.lifestyle_advice,
            'food_advice': rec.food_advice,
            'medical_advice': rec.medical_advice
        }), 200

    elif request.method == 'PUT':
        data = request.json
        for key in data:
            setattr(rec, key, data[key])
        db.session.commit()
        return jsonify({'message': 'Recommendation updated successfully'}), 200

    elif request.method == 'DELETE':
        db.session.delete(rec)
        db.session.commit()
        return jsonify({'message': 'Recommendation deleted successfully'}), 200


# ====================== EXISTING ROUTES ======================
@admin_bp.route('/reply-inquiry/<int:inquiry_id>', methods=['POST'])
def reply_inquiry(inquiry_id):
    inquiry = Inquiry.query.get_or_404(inquiry_id)
    data = request.json

    inquiry.response = data['response']
    db.session.commit()

    user = User.query.get(inquiry.user_id)
    msg = Message("Response to Your Inquiry",
                  sender="kidneycareai@gmail.com",
                  recipients=[user.email])
    msg.body = f"Dear {user.username},\n\n{data['response']}\n\nBest regards,\nKidney Care AI Team"
    mail.send(msg)

    return jsonify({'message': 'Reply sent successfully'}), 200


@admin_bp.route('/statistics', methods=['GET'])
def get_statistics():
    ckd_count = DetectionResult.query.filter_by(prediction=1).count()
    non_ckd_count = DetectionResult.query.filter_by(prediction=0).count()
    return jsonify({
        'ckd_cases': ckd_count,
        'non_ckd_cases': non_ckd_count
    }), 200

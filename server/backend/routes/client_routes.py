from flask import Blueprint, request, jsonify, session
from backend.models.detection_result import DetectionResult
from backend.models.recommendations import Recommendation
from backend.models.inquiries import Inquiry
from backend.models.general_info import GeneralInfo
from backend.database import db
import pickle

client_bp = Blueprint('client', __name__)

# Load CKD detection model
with open('ckd_model.pkl', 'rb') as f:
    model = pickle.load(f)


@client_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Extract features in exact order the model expects
        features = [
            float(data['age']),
            float(data['blood_pressure']),
            float(data['specific_gravity']),
            float(data['albumin']),
            float(data['blood_glucose_random']),
            float(data['blood_urea']),
            float(data['serum_creatinine']),
            float(data['sodium']),
            float(data['hemoglobin']),
            float(data['packed_cell_volume']),
            float(data['red_blood_cell_count']),
            int(data['hypertension']),  # 0 or 1
            int(data['diabetes_mellitus'])  # 0 or 1
        ]

        # Make prediction
        prediction = model.predict([features])[0]

        # Save to database
        new_result = DetectionResult(
            user_id=session['user_id'],
            prediction=int(prediction)
        )
        db.session.add(new_result)
        db.session.commit()

        return jsonify({
            'prediction': int(prediction),
            'message': 'CKD Detected' if prediction == 1 else 'No CKD Detected'
        }), 200

    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@client_bp.route('/calculate-egfr', methods=['POST'])
def calculate_egfr():
    try:
        data = request.json

        # Validate input
        required_fields = ['age', 'serum_creatinine', 'gender']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Convert inputs
        age = float(data['age'])
        serum_creatinine = float(data['serum_creatinine'])  # in mg/dL
        gender = data['gender'].lower()

        # Validate gender
        if gender not in ['male', 'female']:
            return jsonify({'error': 'Invalid gender. Use "male" or "female"'}), 400

        # 2021 CKD-EPI Creatinine Equation (Race-free)
        if gender == 'female':
            k = 0.7  # mg/dL
            alpha = -0.241
            multiplier = 142
            sex_factor = 1.012
        else:  # male
            k = 0.9  # mg/dL
            alpha = -0.302
            multiplier = 142
            sex_factor = 1.0

        scr_ratio = serum_creatinine / k

        # Calculate eGFR with proper parentheses
        egfr = multiplier * \
               (min(scr_ratio, 1) ** alpha) * \
               (max(scr_ratio, 1) ** -1.2) * \
               (0.9938 ** age) * \
               sex_factor

        # Round to nearest integer
        egfr = round(egfr)

        # Get recommendations
        recommendation = Recommendation.query.filter(
            Recommendation.egfr_range_low <= egfr,
            Recommendation.egfr_range_high >= egfr
        ).first()

        if not recommendation:
            return jsonify({'error': 'No recommendations available for this eGFR level'}), 404

        return jsonify({
            'egfr': egfr,
            'unit': 'mL/min/1.73m²',
            'stage': recommendation.stage,
            'recommendations': {
                'lifestyle': recommendation.lifestyle_advice,
                'diet': recommendation.food_advice,
                'medical': recommendation.medical_advice
            }
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Invalid numeric value: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@client_bp.route('/submit-inquiry', methods=['POST'])
def submit_inquiry():
    """Submit a new inquiry (Client Only)"""
    try:
        # Verify client authentication
        if 'user_id' not in session or session.get('user_type') != 'client':
            return jsonify(error="Authentication required"), 401

        data = request.json
        if not data.get('message'):
            return jsonify(error="Message content required"), 400

        # Create inquiry
        new_inquiry = Inquiry(
            user_id=session['user_id'],
            message=data['message'].strip()
        )

        db.session.add(new_inquiry)
        db.session.commit()

        return jsonify(
            message="Inquiry submitted successfully",
            inquiry_id=new_inquiry.id
        ), 201

    except Exception as e:
        db.session.rollback()
        return jsonify(error="Failed to submit inquiry"), 500


@client_bp.route('/view-general-info', methods=['GET'])
def view_general_info():
    """Get general CKD information (Client Access)"""
    try:
        # 1. Authentication check
        if 'user_id' not in session or session.get('user_type') != 'client':
            return jsonify({"error": "Authentication required"}), 401

        # 2. GET request handling
        info_items = GeneralInfo.query.all()

        # 3. Serialize data
        return jsonify([{
            'id': item.id,
            'title': item.title,
            'content': item.content
        } for item in info_items]), 200

    except Exception as e:
        # 4. Error handling (no need for db rollback on read-only operation)
        return jsonify({"error": "Failed to retrieve information"}), 500
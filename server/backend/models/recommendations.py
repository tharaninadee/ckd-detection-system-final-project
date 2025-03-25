from backend.database import db

class Recommendation(db.Model):
    __tablename__ = 'recommendations'
    id = db.Column(db.Integer, primary_key=True)
    stage = db.Column(db.String(50), nullable=False)
    egfr_range_low = db.Column(db.Float, nullable=False)
    egfr_range_high = db.Column(db.Float, nullable=False)
    lifestyle_advice = db.Column(db.Text, nullable=False)
    food_advice = db.Column(db.Text, nullable=False)
    medical_advice = db.Column(db.Text, nullable=False)
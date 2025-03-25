from backend.database import db

class DetectionResult(db.Model):
    __tablename__ = 'detection_results'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    prediction = db.Column(db.Integer, nullable=False)  # 1=CKD, 0=No CKD
    created_at = db.Column(db.DateTime, server_default=db.func.now())

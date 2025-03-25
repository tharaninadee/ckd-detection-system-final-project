from backend.database import db

class GeneralInfo(db.Model):
    __tablename__ = 'general_info'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)

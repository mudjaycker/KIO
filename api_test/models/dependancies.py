from datetime import datetime
from instances.db import db

class User(db.Model):
    __tablename__ = "user"
    __table_args__ = (
        db.PrimaryKeyConstraint('user_id',),
    )
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50))
    password = db.Column(db.String(50))

    def to_json(self):
        return {
            "user_id": self.user_id,
            "user_name": self.user_name,
        }
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
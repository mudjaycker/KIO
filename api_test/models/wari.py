from . import dependancies as d



class Wari(d.db.Model):
    __tablename__ = "wari"
    user = d.db.Column(d.db.String(50), d.db.ForeignKey("user.phone_number"), nullable=False)
    sending_id = d.db.Column(
        d.db.String(50), primary_key=True
    )
    sending_date = d.db.Column(
        d.db.DateTime, nullable=False, default=d.datetime.utcnow()
    )
    transac_amount = d.db.Column(d.db.Float)
    receiver_id = d.db.Column(d.db.String(50))

    def to_json(self):
        return {
            "user": self.user,
            "sending_id": self.sending_id,
            "sending_date": self.sending_date,
            "transac_amount": self.transac_amount,
            "receiver_id": self.receiver_id,
        }

    @classmethod
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def find_id_transac(cls, id_: int):
        return cls.query.filter_by(id_=id_).first()

    @classmethod
    def find_all_by_user(cls, id_: int):
        return cls.query.filter_by(user=id_)

    def save_to_db(self):
        d.db.session.add(self)
        d.db.session.commit()


from flask_openapi3 import OpenAPI
from flask_openapi3 import Info
from views.wari import api as wari
from views.user import api as user

info = Info(title='api_test API', version='1.0.0')
app = OpenAPI(__name__, info=info)

app.secret_key = "bz19BJ9819GTG19BZ6998_756464-1jhgjojuugy"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["PROPAGATE_EXCEPTIONS"] = True


# register api
app.register_api(user)
app.register_api(wari)

if __name__ == '__main__':
    from instances.db import db
    db.init_app(app)
    @app.before_first_request
    def create_tables():
        db.create_all()
    app.run(debug=True)

from .dependancies import *
from schemas.user import *
from models.dependancies import User

tag = Tag(name="api_test", description="user")
api = APIBlueprint(
    "/api_test/user",
    __name__,
    url_prefix="/api",
    abp_tags=[tag],
    # disable openapi UI
    doc_ui=True,
)


@api.post("/api_test/user")
def create_user(body: UserBody):
    "Post a user"
    d = body.dict()
    user = User(**d)
    user.save_to_db()
    return {"code": 0, "message": "ok", "datas": [d]}


@api.get("/user/<int:phone_number>")
def get_one_user(path: UserQuery):
    """Get one user by his number"""

    user = User.query.filter_by(phone_number=path.phone_number).first()
    if user:
        return {"datas": dict(UserBodyDeserializer(**user.to_json()))}
    else:
        return {"message": "no user with this phone_number"}, 404


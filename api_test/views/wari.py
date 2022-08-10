from models.wari import Wari
from models.dependancies import User
from schemas.wari import WariBody, WariQuery, WariBodyDeserializer
from .dependancies import *


tag = Tag(name="api_test", description="Wari account")

api = APIBlueprint(
    "/api_test/wari",
    __name__,
    url_prefix="/api",
    abp_tags=[tag],
    # disable openapi UI
    doc_ui=True,
)


@api.get("/list/<string:user>")
def get_api_test(path: WariQuery):
    """Get all Trasanction for a user
    """
    return {
        "datas": [
            dict(WariBodyDeserializer(**transaction.to_json()))
            for transaction in Wari.query.filter_by(user=path.user)
        ]
    }


@api.post("/create")
def create_api_test(body: WariBody):
    "Post a new transaction of wari"
    wari = Wari(**body.dict())
    wari.save_to_db()
    print(Wari.query.all())
    return {"code": 0, "message": "ok", "datas": body.dict()}


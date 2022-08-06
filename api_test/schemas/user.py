from . import dependancies as d

class UserQuery(d.BaseModel):
    user_id: int


class UserBody(d.BaseModel):
    user_name: d.StrictStr
    password: d.StrictStr




class UserBodyDeserializer(d.BaseModel):
    user_id: int
    user_name: d.StrictStr

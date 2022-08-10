from . import dependancies as d

class UserQuery(d.BaseModel):
    phone_number: str


class UserBody(d.BaseModel):
    user_name: d.StrictStr
    phone_number: d.StrictStr
    password: d.StrictStr




class UserBodyDeserializer(d.BaseModel):
    user_id: int
    phone_number: d.StrictStr
    user_name: d.StrictStr

from typing import List, Optional
from . import dependancies as d

import string
import random

def random_sending_id():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(21))

class WariQuery(d.BaseModel):
    user: int


class WariBody(d.BaseModel):
    user: int
    sending_id : str = random_sending_id()
    sending_date: Optional[d.datetime] = d.datetime.utcnow()
    transac_amount: float = 0.0
    receiver_id: str




class WariBodyDeserializer(d.BaseModel):
    user: int
    sending_id: d.StrictStr
    sending_date: d.datetime
    transac_amount: float 
    receiver_id: str

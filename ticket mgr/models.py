from pydantic import BaseModel, EmailStr
from datetime import datetime,date as _date,  time as _time, timedelta

class User(BaseModel):
    first_name :str
    last_name: str
    username: str
    email: EmailStr
    active: bool = True
    password: str
    date_created: datetime | None = None

class Event(BaseModel):
    name: str
    creator_id: str | None = None
    venue: str
    date: _date
    time: _time | str
    duration: timedelta | int
    ticket_price: float
    capacity: int
    slots_filled: int | None = 0     #what about price

class Ticket(BaseModel):
    user_id: str
    event_id: str
    code: bool = True

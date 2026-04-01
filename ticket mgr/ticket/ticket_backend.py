from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from security.auth import authenticate, oauth2_scheme
import secrets
from db import TICKET_DATABASE, EVENTS_DATABASE
from bson import ObjectId
from datetime import datetime,timezone,time

router = APIRouter()

def custom_json_serializer(doc: dict) -> dict:
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)                         #reviewed version
        elif isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, time):
            doc[key] = value.strftime("%H:%M:%S")
    return doc

# @router.post("/create_ticket/{event_id}")
async def create_ticket(event_id, token = Depends(oauth2_scheme)):
    user = await authenticate(token)

    try:
        event = await EVENTS_DATABASE.find_one(filter={"_id": ObjectId(event_id)})
    except Exception as e:
        print(e)

    else:
        event_date = event["date"].split("-")
        event_time = event["time"].split(":")

        date_time = datetime(year=event_date[0],
                             month=event_date[1],
                             day=event_date[2],
                             hour=event_time[0],
                             minute=event_time[1],
                             second=event_time[2])
        
        if date_time > datetime.now(tz=timezone.utc):
            raise HTTPException(401, "Event has begun")
        
        if len(await TICKET_DATABASE.find({"user_id":user.get("_id"),"event_id": event["_id"],})) > 0:
            raise HTTPException(401, "You already have a ticket")
        
        code = secrets.token_hex(16)
        
        new_ticket = {
            "user_id": user.get("_id"),
            "event_id": event["_id"],
            "code": code
        }

        await TICKET_DATABASE.insert_one(new_ticket)
        return None
    
@router.get("/my-tickets/cursor")
async def view_my_tickets_cursor(
    limit: int = Query(6, ge=1, le=100),
    last_date: str | None = None,
    last_time: str | None = None,
    last_id: str | None = None,
    token = Depends(oauth2_scheme)
):
    user = await authenticate(token)
    user_id = user.get("_id")
    db = TICKET_DATABASE
    query = {"user_id": ObjectId(user_id)}

    if (last_date) and (last_time) and (last_id) and (user_id):
        try:
            last_id = ObjectId(last_id)
        except Exception:
            raise HTTPException(status_code=404,detail="invalid data")
        query["$or"] = [
                {"event_date": {"$gt": last_date}},
                {"event_date": last_date, "event_time": {"$gt": last_time}},
                {"event_date": last_date, "event_time": last_time, "_id": {"$gt": last_id}}
            ]
    
    cursor = db.find(query).sort([("user_id", 1), ("event_date", 1), ("event_time", 1), ("_id", 1)]).limit(limit + 1)

    data = []
    async for ticket in cursor:
        ticket = custom_json_serializer(ticket)
        sensitised_ticket = {
                                "_id": ticket["_id"],
                                "event_name": ticket["event_name"],
                                "event_venue": ticket["event_venue"],
                                "event_date": ticket["event_date"],
                                "event_time": ticket["event_time"],
                                "code": ticket["code"]
                            }
        data.append(sensitised_ticket)

    next_cursor = {}
    has_more = False
    if data and len(data) > limit:
        has_more = True
        last = data[-2]
        next_cursor = {
            "date": last["date"],
            "time": last["time"],
            "_id": last["_id"]
        }
        data = data[:-1]

    payload = {
        "data": data,
        "next_cursor": next_cursor,
        "has_more": has_more
    }
    return JSONResponse(content=payload)
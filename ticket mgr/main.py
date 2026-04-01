from fastapi import UploadFile,APIRouter, Request, HTTPException, File, Depends, Query
from models import Event
from datetime import datetime, timezone, time
from os import path
from bson import ObjectId
from fastapi.responses import JSONResponse
import aiofiles
from pydantic import BaseModel
from security.auth import authenticate, oauth2_scheme
from consts import MEDIA_FOLDER
from db import client, EVENTS_DATABASE

COVER_PHOTO_FOLDER = path.join(MEDIA_FOLDER,"EVENT_COVER_PHOTOS")
router = APIRouter()

class dislay_ticket_request_schema(BaseModel):
    user_id: str

class attendee_list_request_schema(BaseModel):
    event_id: str


def custom_json_serializer(doc: dict) -> dict:
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)                         #reviewed version
        elif isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, time):
            doc[key] = value.strftime("%H:%M:%S")
    return doc

@router.get("/get-event-data/{event_id}")
async def getEventData(event_id, token = Depends(oauth2_scheme)):
    user = await authenticate(token)

    event_id = str(event_id)
    db = EVENTS_DATABASE
    try:
        cursor = db.find({"_id": ObjectId(event_id)})
        events = await cursor.to_list()
        data = []
        for event in events:
            data.append(custom_json_serializer(event))
        return JSONResponse(content=data[0])


    except Exception as e:
        print(e)
        return HTTPException(404, detail="Not found")


@router.get("/user_data")
async def check_username(token = Depends(oauth2_scheme)):
    user_data = await authenticate(token)
    safe_fields = ["first_name", "last_name", "username"]
    sent_data = {i: user_data.get(i, None) for i in safe_fields}
    
    return sent_data


@router.post("/create_event")
async def create_event(request: Request, cover_photo_file: UploadFile | None = File(None), token = Depends(oauth2_scheme)):    
    try: 
        event_data = Event(**await request.form())
        event = dict(event_data)
    except Exception as e:
        print("Eheh eheh ", e)
        raise HTTPException(401, "Invalid data")
    user = await authenticate(token)
    event["creator_id"] = user.get("_id")
    db = EVENTS_DATABASE
    
    if cover_photo_file:
        if cover_photo_file.filename:
            ext = cover_photo_file.filename.split(".")[-1]
            filename = datetime.strftime(datetime.now(timezone.utc), "%d-%m-%Y-%H-%M-%S") +"."+ ext 
            chunk_size = 1024 * 1024
            async with aiofiles.open(path.join(COVER_PHOTO_FOLDER, filename), "wb") as file:
                while True:
                    content = await cover_photo_file.read(chunk_size)
                    if not content:
                        break
                    await file.write(content)
            event["cover-photo"] = filename

    _time = event["time"].split(":")
    event["time"] = time(hour=int(_time[0]), minute=int(_time[1])).strftime("%H:%M:%S")
    event["date"] = str(event["date"])
    await db.insert_one(event)
    return {"success": "event created successfully"}

@router.get("/my_events")
async def view_my_events(request: Request, token = Depends(oauth2_scheme)):
    user = await authenticate(token)
    user_id = user.get("_id")
    db = EVENTS_DATABASE
    cursor = db.find(filter = {"creator_id": user_id})
    events = await cursor.to_list()
    data = []
    for event in events:
        data.append(custom_json_serializer(event))
    return JSONResponse(content=data)

@router.get("/my_events/cursor")
async def view_my_events_cursor(
    limit: int = Query(6, ge=1, le=100),
    last_date: str | None = None,
    last_time: str | None = None,
    last_id: str | None = None,
    token = Depends(oauth2_scheme)
):
    user = await authenticate(token)
    creator_id = user.get("_id")
    db = EVENTS_DATABASE
    query = {"creator_id": ObjectId(creator_id)}

    if (last_date) and (last_time) and (last_id) and (creator_id):
        try:
            last_id = ObjectId(last_id)
        except Exception:
            raise HTTPException(status_code=404,detail="invalid data")
        query["$or"] = [
                {"date": {"$gt": last_date}},
                {"date": last_date, "time": {"$gt": last_time}},
                {"date": last_date, "time": last_time, "_id": {"$gt": last_id}}
            ]
        
    cursor = db.find(query).sort([("creator_id", 1), ("date", 1), ("time", 1), ("_id", 1)]).limit(limit + 1)

    data = []
    async for event in cursor:
        data.append(custom_json_serializer(event))
    
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

@router.get("/events")
async def get_events():
    db = EVENTS_DATABASE
    cursor = db.find({})
    events = cursor
    data = []
    async for event in events:
        data.append(custom_json_serializer(event))
    return JSONResponse(content=data)

@router.get("/events/cursor")
async def get_events_cursor(
    limit: int = Query(6, ge=1, le=100),
    last_date: str | None = None,
    last_time: str | None = None,
    last_id: str | None = None
):
    db = EVENTS_DATABASE
    query = {}

    if (last_date) and (last_time) and (last_id):
        query = {
            "$or": [
                {"date": {"$gt": last_date}},
                {"date": last_date, "time": {"$gt": last_time}},
                {"date": last_date, "time": last_time, "_id": {"$gt": last_id}}
            ]
        }
    cursor = db.find(query).sort([("date", 1), ("time", 1), ("_id", 1)]).limit(limit + 1)

    data = []
    async for event in cursor:
        data.append(custom_json_serializer(event))
    next_cursor = None
    has_more = False

    if data and (len(data) > limit):
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
        "has_more": has_more,
        "next_cursor": next_cursor
    }

    return JSONResponse(content=payload)


@router.get("/cover-photos/{image_id}")    #for event cover photos  still working on it
async def get_images(image_id):
    pass

@router.post("/tickets")
async def get_tickets_attendee(request: Request):
    try:
        req_info = dislay_ticket_request_schema( **await request.json())
    except:
        return {"err": "invalid request"}    #future me check whether its better to return error message or raise
    user_id = req_info.get("user_id")
    db = EVENTS_DATABASE
    docs = await db.find({"user_id":user_id}).to_list()
    return docs

@router.post("/tickets/attendee-list")
async def get_tickets_attendee(request: Request):
    try:
        req_info = attendee_list_request_schema( **await request.json())
    except:
        return {"err": "invalid request"}    #future me check whether its better to return error message or raise
    event_id = req_info.get("event_id")
    db = client["main"]["tickets"]
    docs = await db.find({"event_id":event_id}).to_list()
    return docs
from config import settings
from fastapi import APIRouter, Depends, HTTPException, Request
from security.auth import authenticate, oauth2_scheme
from pydantic import BaseModel, Field
from db import EVENTS_DATABASE, TICKET_PMT_DB, TICKET_DATABASE
from bson import ObjectId
from datetime import datetime
from random import choices
from string import ascii_letters,digits
import requests
from json import dumps
import secrets

DJANBANK_API_KEY = settings.DJANBANK_PAYMENT_API_KEY
DJANBANK_GATEWAY_URL = settings.DJANBANK_PAYMENT_GATEWAY_URL
BACKEND_URL = settings.BACKEND_URL
PMT_OPTIONS = ["DJANBANK"]

router = APIRouter()

chars = ascii_letters + digits
def id_generator(number= 8):
    return "".join(choices(chars, k=number))

class pmt_info_schema(BaseModel):
    event_id : str
    pmt_opt: str

class pmt_result_schema(BaseModel):
    status: str
    callback_code: str = Field(alias="callback-code")
    client_id: str = Field(alias="client-id")
    transaction_id: str = Field(alias="transaction-id")
    api_key: str = Field(alias="api-key")

@router.post("/pmt_info")
async def receive_pmt_info(request: Request, token=Depends(oauth2_scheme)):
    user = await authenticate(token)
    try:
        pmt_info = dict(pmt_info_schema(** await request.json()))
    except:
        raise HTTPException(400, "Invalid format")
    
    try:
        event = await EVENTS_DATABASE.find_one({"_id": ObjectId(pmt_info["event_id"])})

        if event["slots_filled"] >= event["capacity"]:
            raise Exception

    except Exception as e:
        print(e)
        raise HTTPException(404, 'event issue')
    
    if pmt_info["pmt_opt"] not in PMT_OPTIONS:
        raise HTTPException(400, "Invalid option")
    
    if pmt_info["pmt_opt"] == "DJANBANK":
        api_key = DJANBANK_API_KEY
        gateway = DJANBANK_GATEWAY_URL

        ticket_pmt_doc = {
            "user_id": ObjectId(str(user["_id"])),
            "client_id": str(user["_id"]) + id_generator(),
            "event_id": ObjectId(str(event["_id"])),
            "price": event["ticket_price"],
            "date_created": datetime.now().timestamp(),
            "callback_code": id_generator(),
            "status": "PENDING"
        }
        ticket_pmt_doc_insert_result = await TICKET_PMT_DB.insert_one(ticket_pmt_doc)

        ticket_pmt_model = await TICKET_PMT_DB.find_one({"_id": ticket_pmt_doc_insert_result.inserted_id})
        payload = {
            'merchant-id': f'{api_key}',
            'client-id': f'{ticket_pmt_model["client_id"]}',
            'transaction-id': f'{str(ticket_pmt_model["_id"])}',
            'amount': f'{ticket_pmt_model["price"]}',
            'currency': f'USD',
            'callback-url': f'{BACKEND_URL}/payment/pmt_result',   #find this out
            'callback-code': f'{ticket_pmt_model["callback_code"]}'
        }

        post_res = requests.post(
            url=f'{DJANBANK_GATEWAY_URL}/', 
            data=dumps(payload),
            headers={'type-of-request' : 'transaction-details'})
        
        if post_res.status_code >= 400:
            raise HTTPException(400, "PAYMENT_ERROR")
        
        return {
            'new_url': f'{DJANBANK_GATEWAY_URL}/?client-id={ticket_pmt_model["client_id"]}&merchant-id={api_key}&transaction-id={str(ticket_pmt_model["_id"])}'
        }

@router.post("/pmt_result")
async def pmt_result_page(request: Request):
    try:
        data = dict(pmt_result_schema.model_validate(await request.json()))
    except Exception as e:
        print(e)
        raise HTTPException(401, "Invalid JSON")
    
    filter = {
        "_id": ObjectId(data["transaction_id"])
    }
    if data["status"].upper() == "SUCCESS": 
        pmt_doc = await TICKET_PMT_DB.find_one_and_update(filter=filter, update={"$set": {"status": data["status"].upper()}})
        event_doc = await EVENTS_DATABASE.find_one_and_update(
            filter={"_id": ObjectId(str(pmt_doc["event_id"]))},
            update={"$inc":{'slots_filled' : 1}})

        ticket_doc = {
            "user_id": ObjectId(str(pmt_doc["user_id"])),
            "event_id": ObjectId(str(pmt_doc["event_id"])),
            "pmt_id": ObjectId(str(pmt_doc["_id"])),
            "event_name": event_doc["name"],
            "event_venue": event_doc["venue"],
            "event_date": event_doc["date"],
            "event_time": event_doc["time"],
            "code": secrets.token_hex(16),
        }
        await TICKET_DATABASE.insert_one(ticket_doc)

    else:
        await TICKET_PMT_DB.update_one(filter=filter, update={"$set": {"status": data["status"].upper()}})

    
    
from fastapi import HTTPException, APIRouter, Request, Response, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from models import User
from bson import ObjectId
from hashlib import sha256
from datetime import datetime, timezone
from security.jwt import create_access_token, create_refresh_token, decode_token
from security.passwords import hash_password, verify_password
import aiofiles
import cloudinary
from pathlib import Path
from os.path import join
from consts import MEDIA_FOLDER
from db import get_user, USER_DATABASE, REFRESH_TOKEN_DATABASE

PROFILE_PHOTO_FOLDER = join(MEDIA_FOLDER,"PROFILE PHOTOS")

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

class login_schema(BaseModel):
    username: str
    password: str

class logout_form(BaseModel):
    refresh_token: str


async def authenticate(token) -> dict:           #to get user from access token    still working on it
    try:
        payload = await decode_token(token)
    except Exception as e:
        print(e)
        raise HTTPException(401, "Access token has exired")
    user_id = payload.get("sub")
    user_model = await USER_DATABASE.find_one(filter={"_id": ObjectId(user_id)})
    return user_model

@router.post("/renew-access-token")
async def get_access_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token: raise HTTPException(401, "No refresh token")
    hashed_token = sha256(refresh_token.encode()).hexdigest()

    db = REFRESH_TOKEN_DATABASE
    data = await db.find_one(filter={"hashed_token": hashed_token})

    if data is None:
        raise HTTPException(401, detail="Token doesn't exist")   #please change this later, I somehow think it's a security risk. not sure yet
    # print(data["exp_date"])
    # exp_date = datetime.fromtimestamp(data["exp_date"], tz=timezone.utc)
    exp_date = data["exp_date"]
    if (exp_date) <= (datetime.now(timezone.utc)):
        raise HTTPException(401, detail="Expired Token Error")

    if not data["valid"]:
        raise HTTPException(401, detail="Invalid Token Error")
    
    try:
        jwt_payload = await decode_token(refresh_token)           #want to decode  payload
        user_id = jwt_payload.get("sub")
    except  Exception as e:
        print(e)
        raise HTTPException(401, detail="Invalid Token Error3")
    
    user = await USER_DATABASE.find_one(filter={
        "_id": ObjectId(user_id)
    })
    if (user is None) or (not user["active"]):
        raise HTTPException(401, detail="Invalid Token Error2")

    token = await create_access_token(user_id, [])      #not sure of scopes yet
    return {"access_token":token}


@router.post("/login")
async def login(request: Request, response: Response):
    form = await request.form()
    form = login_schema(**form)
    form_data = dict(form)
    user = await get_user(form_data["username"])
    try:
        if user is not None:
            if verify_password(form_data["password"], user["password"]):
                access_token = await create_access_token(
                    user_id=str(user["_id"]),
                    scopes=[]
                )
                refresh_token = await create_refresh_token(
                    user_id=str(user["_id"])
                )
                response.set_cookie(
                    key="refresh_token",
                    value=refresh_token,
                    httponly=True,
                    secure=True,
                    samesite="none",
                    # secure=False,
                    # samesite="lax",
                    max_age=86400
                )
                print(f"{user["username"]} has logged in")
                safe_fields = ["first_name", "last_name", "username"]
                sent_data = {i: user.get(i, None) for i in safe_fields}
                return {"success": "Login successful", "user_data": {**sent_data}}
                return {"access_token": access_token}    #learned that this shouldn't be, access tokens should only be gotten from the refresh endpoint
            else:
                raise HTTPException(401, "Invalid Credentials")
        else:
            raise HTTPException(401, "Invalid Credentials")

    except Exception as e:
        print("error at login", e)
        raise HTTPException(401, "Invalid Credentials")


@router.post("/signup")
async def create_user(request: Request, profile_pic: UploadFile | None = File(None)):
    user_data = await request.form()
    user_data = User(** user_data)
    user = dict(user_data)
    db = USER_DATABASE
    
    if await db.count_documents(filter={"username":user["username"]}):
        raise HTTPException(404, "User already exists")
    
    user["password"] = hash_password(user["password"])
    user["date_created"] = datetime.now(tz=timezone.utc)

    image = cloudinary.uploader.upload(
            profile_pic.file,
            folder="eventMGT__profile_images"
        )
    user["profile_pic_url"] = image["secure_url"]
    result = await db.insert_one(user)
    # _id = result.inserted_id
    # _id_str = str(_id)

    # if profile_pic and profile_pic.filename:
    #     ext = profile_pic.filename.split(".")[-1]
    #     updated_filename = "profile_pic-"+ _id_str + datetime.strftime(datetime.now(tz=timezone.utc), "%d-%m-%Y-%H-%M-%S") +"."+ ext
    #     chunk_size = 1024 * 1024
    #     dest_dir = Path(join(PROFILE_PHOTO_FOLDER, f"{_id_str}"))
    #     if not dest_dir.exists():
    #         dest_dir.mkdir()

    #     path = join(PROFILE_PHOTO_FOLDER, f"{_id_str}", updated_filename)
    #     async with aiofiles.open(path, "wb") as file:
    #         while True:
    #             chunk = await profile_pic.read(chunk_size)
    #             if not chunk:
    #                 break
    #             await file.write(chunk)
    #     await db.find_one_and_update({"_id": _id}, 
    #                                     {
    #                                     "$set": {"profile_pic": path}
    #                                     })   
    return {"success": "User successfully created"}


@router.post("/logout")
async def logout(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token: raise HTTPException(401, "No refresh token")

    hashed_token = sha256(refresh_token.encode()).hexdigest()
    data = await REFRESH_TOKEN_DATABASE.find_one(filter={"hashed_token": hashed_token})
    if not data:
        raise HTTPException(status_code=401, detail="Invalid Token")        
    await REFRESH_TOKEN_DATABASE.delete_one(filter={"hashed_token": hashed_token})
    return {"detail": "logout successful"}
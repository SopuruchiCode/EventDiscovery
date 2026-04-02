from pymongo import AsyncMongoClient
from config import settings


# db_username = settings.MONGO_DB_USERNAME
# db_password = settings.MONGO_DB_PASSWORD

# connection_string = f"mongodb://{db_username}:{db_password}@localhost:27018/"
connection_string = settings.MONGO_DB_URI
client = AsyncMongoClient(connection_string, tz_aware=True)

USER_DATABASE = client["auth"]["users"]
REFRESH_TOKEN_DATABASE = client["auth"]["refresh-tokens"]
EVENTS_DATABASE = client["main"]["events"]
TICKET_DATABASE = client["main"]["tickets"]
TICKET_PMT_DB = client["main"]["ticket_pmts"]

async def get_user(username):
    db = client["auth"]["users"]
    user = await db.find_one(filter={"username":username})
    return user
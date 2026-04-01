from db import REFRESH_TOKEN_DATABASE, USER_DATABASE, EVENTS_DATABASE, TICKET_DATABASE
import asyncio
# asyncio.run(REFRESH_TOKEN_DATABASE.create_index("exp_date", expireAfterSeconds=0))
# print("oj")

# asyncio.run(USER_DATABASE.create_index("username", unique=True))
# print("ok")

# asyncio.run(EVENTS_DATABASE.create_index([("date", 1), ("time", 1), ("_id", 1)]))

# asyncio.run(EVENTS_DATABASE.create_index([("creator_id", 1), ("date", 1), ("time", 1), ("_id", 1)]))

# asyncio.run(TICKET_DATABASE.create_index([("user_id", 1), ("event_date", 1), ("event_time", 1), ("_id", 1)]))
# print("ok")
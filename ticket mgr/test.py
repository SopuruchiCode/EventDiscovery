# import requests
# import pprint

# cookies = {"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTI2OTRhNmY5MThhMDZhNDYxY2NmZmQiLCJpYXQiOjE3NjczNjkxMDIsImV4cCI6MTc2NzQ1NTUwMiwidHlwZSI6InJlZnJlc2giLCJzY29wZXMiOltdfQ.OeG2pkTjSe957MX8-80Kulja38xhPQkjXeY7YuoPxUI"}
# url="http://127.0.0.1:8000/auth/renew-access-token"
# res = requests.post(url=url, cookies=cookies)
# data = res.json()
# print(res.json())
# access_token = data.get("access_token")


# url = "http://127.0.0.1:8000/my_events/cursor?last_date=2026-01-08&last_time=09:00:00&last_id=700000000000000000000057"
# # url = "http://127.0.0.1:8000/my_events/cursor?last_date=2026-01-08&last_time=09:00:00&last_id=700000000000000000000165"
# # url = "http://127.0.0.1:8000/my_events/cursor?limit=10"

# data = requests.get(url, headers={ "Authorization": "Bearer " + access_token})
# print(data.json())
# for event in data.json()["data"]:
#     print(f"{event["date"]}, {event["time"]}, {event["creator_id"]}, {event["_id"]}")


##################################################################################################################


# import bson.json_util
# from db import EVENTS_DATABASE
# import aiofiles
# import asyncio
  
# async def save_data():
#     documents = await EVENTS_DATABASE.find({}).to_list()
#     data = bson.json_util.dumps(documents, indent=2)

#     async with aiofiles.open("events2.json", "w") as file:
#         await file.write(data)

#     print("Events collection saved successfully")

# asyncio.run(save_data())

###############################################################################################################

# import asyncio
# from db import EVENTS_DATABASE
# import random
# async def update_ticket_price():
#     def random_price():
#         prices = [200, 50, 12, 750 , 1000]
#         return prices[random.randint(0, len(prices) -1)]
#     await EVENTS_DATABASE.update_many({},
#                                 {
#                                     "$set":{
#                                         "ticket_price": random_price()    #this gave everone the same value
#                                     }
#                                 })
#     print("prices_updated")
# asyncio.run(update_ticket_price())


###################################################################

import requests
import pprint

cookies = {"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTI2OTRhNmY5MThhMDZhNDYxY2NmZmQiLCJpYXQiOjE3NzI5Njc2MTYsImV4cCI6MTc3MzA1NDAxNiwidHlwZSI6InJlZnJlc2giLCJzY29wZXMiOltdfQ.1t_hK6E1eroTUL5AI6Yp4SVKFIioBUTQbtKkuxsFwmQ"}
url="http://127.0.0.1:8000/auth/renew-access-token"
res = requests.post(url=url, cookies=cookies)
data = res.json()
print(res.json())
access_token = data.get("access_token")



url = "http://127.0.0.1:8000/ticket/my-tickets/cursor"

data = requests.get(url, headers={ "Authorization": "Bearer " + access_token})
print(len(data.json()))
# for event in data.json()["data"]:
#     print(f"{event["date"]}, {event["time"]}, {event["creator_id"]}, {event["_id"]}")

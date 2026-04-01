from dotenv import load_dotenv
from os import getenv
from os.path import join


load_dotenv()

BASE_FOLDER = getenv("BASE_FOLDER")
MEDIA_FOLDER = join(BASE_FOLDER, "MEDIA")

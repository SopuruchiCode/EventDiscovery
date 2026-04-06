from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
import cloudinary
import main, security.auth, ticket.ticket_backend, payment.ticket_payment

app = FastAPI()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main.router, prefix="")
app.include_router(security.auth.router, prefix="/auth", tags=["auth"])
app.include_router(ticket.ticket_backend.router, prefix="/ticket", tags=["ticket"])
app.include_router(payment.ticket_payment.router, prefix="/payment")

# app.mount("/default_cover_photos", StaticFiles(directory="MEDIA\EVENT_COVER_PHOTOS\DEFAULTS"), name="default_cover_photos")
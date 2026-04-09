from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 5
    ACCESS_TOKEN_EXPIRE_DAYS: int = 1


    BACKEND_CORS_ORIGINS : list[str] = [
                                        # 'http://127.0.0.1:5500',
                                        # 'http://localhost:3000',
                                        # 'http://localhost:5173',
                                        # 'http://172.25.114.210:5173',
                                        'https://event-discovery-1.vercel.app',
                                        'https://event-discovery-emmanuel10.vercel.app']
    
    BACKEND_URL: str
    MONGO_DB_USERNAME: str
    MONGO_DB_PASSWORD: str
    MONGO_DB_URI: str
    JWT_SECRET: str
    JWT_ALG: str
    BASE_FOLDER: str

    DJANBANK_PAYMENT_API_KEY: str
    DJANBANK_PAYMENT_GATEWAY_URL: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_SECRET: str


    model_config = SettingsConfigDict(env_file=".env")

    
settings = Settings()
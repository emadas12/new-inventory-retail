import os

print("📦 config.py loaded!")

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

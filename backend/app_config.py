import os

print("📦 config.py loaded!")

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:12345678@localhost:5432/shop_inventory')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

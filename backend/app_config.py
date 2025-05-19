import os

print("📦 config.py loaded!")

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:12345678@db:5432/shop_inventory'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

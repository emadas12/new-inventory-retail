import os

print("📦 config.py loaded!")

class Config:
<<<<<<< HEAD
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:12345678@localhost:5432/shop_inventory')
=======
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")

>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
    SQLALCHEMY_TRACK_MODIFICATIONS = False

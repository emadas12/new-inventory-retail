import os

class Config:
    """Configuration class for Flask application."""
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:12345678@localhost/shop_inventory'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

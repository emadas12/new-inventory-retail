from models import db
from app import app

with app.app_context():
    db.drop_all()    # מוחק את כל הטבלאות
    db.create_all()  # יוצר אותן מחדש עם העמודות המעודכנות

print("Database has been reset.")

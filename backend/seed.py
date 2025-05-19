from models import db, Product
from app_config import Config
from flask import Flask

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

products = [
    Product(name="DevOps Keyboard", sku="DEVKEY2025", stock_level=200, category="Accessories", price=120, cost=80),
    Product(name="DevOps Mouse", sku="DEVMOUSE2025", stock_level=150, category="Accessories", price=100, cost=60),
    Product(name="DevOps Monitor", sku="DEVMON2025", stock_level=50, category="Electronics", price=900, cost=600),
    Product(name="DevOps Headset", sku="DEVHEAD2025", stock_level=75, category="Audio", price=199.99, cost=100),
    Product(name="DevOps Laptop Stand", sku="DEVSTAND2025", stock_level=60, category="Accessories", price=89.99, cost=40),
    Product(name="DevOps USB-C Hub", sku="DEVHUB2025", stock_level=15, category="Accessories", price=49.99, cost=20),
    Product(name="DevOps Webcam", sku="DEVWEBCAM2025", stock_level=14, category="Electronics", price=199.99, cost=80),
    Product(name="DevOps Microphone", sku="DEVMIC2025", stock_level=100, category="Audio", price=149.99, cost=90),
    Product(name="Product Test", sku="SKU123", stock_level=25, category="Test Category", price=50, cost=30),
    Product(name="Test ", sku="TEST001", stock_level=25, category="Test Category", price=50, cost=30),
    Product(name="DevOps Flask Success", sku="FLASKDB001", stock_level=50, category="Backend", price=149.99, cost=79.99),
    Product(name="db Test Product", sku="PMTEST001", stock_level=35, category="Testing Tools", price=199.99, cost=120),
]

with app.app_context():
    db.create_all()  # יוצרת את הטבלאות אם הן לא קיימות
    db.session.bulk_save_objects(products)
    db.session.commit()
    print("✅ Products seeded successfully!")

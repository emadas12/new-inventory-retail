from flask import Flask, jsonify, request, Response
from flask_cors import CORS
<<<<<<< HEAD
from models import db, Product, RestockLog, LowStockProduct
from app_config import Config
from datetime import datetime, timedelta
from sqlalchemy import text
import time
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter, Histogram, REGISTRY
=======
from .models import db, Product, RestockLog, LowStockProduct
from .app_config import Config
from datetime import datetime, timedelta
from sqlalchemy import text
>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d

# -------------------- APP INIT --------------------
app = Flask(__name__)
app.url_map.strict_slashes = False
app.config.from_object(Config)

<<<<<<< HEAD
CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

REQUEST_COUNTER = Counter(
    'flask_http_request_total',
    'Total number of HTTP requests grouped by method, endpoint and status',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'flask_http_request_duration_seconds',
    'Histogram of response latency (seconds) by method and endpoint',
    ['method', 'endpoint']
)

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    try:
        duration = time.time() - request.start_time if hasattr(request, 'start_time') else 0
        REQUEST_COUNTER.labels(method=request.method, endpoint=request.path, status=str(response.status_code)).inc()
        REQUEST_LATENCY.labels(method=request.method, endpoint=request.path).observe(duration)
    except Exception:
        pass
    return response

@app.route('/metrics')
def metrics():
    return Response(generate_latest(REGISTRY), mimetype=CONTENT_TYPE_LATEST)

=======
print("✅ Connected to DB:", app.config['SQLALCHEMY_DATABASE_URI'])

CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

# -------------------- PRODUCTS ROUTES --------------------
>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
@app.route('/api/products', methods=['GET', 'POST'])
def manage_products():
    if request.method == 'GET':
        products = Product.query.all()
        return jsonify([p.to_dict() for p in products]), 200
<<<<<<< HEAD
=======

>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
    elif request.method == 'POST':
        data = request.get_json()
        try:
            new_product = Product(
                name=data['name'],
                sku=data['sku'],
                stock_level=data.get('stock_level', 0),
                category=data.get('category'),
                price=data.get('price'),
                cost=data.get('cost'),
                low_stock_threshold=data.get('low_stock_threshold', 10)
            )
            db.session.add(new_product)
<<<<<<< HEAD
            db.session.flush()
            if new_product.stock_level <= new_product.low_stock_threshold:
                db.session.add(LowStockProduct(
                    product_id=new_product.id,
                    name=new_product.name,
                    sku=new_product.sku,
                    stock_level=new_product.stock_level
                ))
            db.session.commit()
            return jsonify(new_product.to_dict()), 201
        except KeyError as e:
            return jsonify({"error": f"Missing field: {e}"}), 400
=======
            db.session.commit()  # ✅ חובה קודם לשמור כדי לקבל ID תקף

            # עכשיו נמשוך שוב את המוצר מה־DB
            saved_product = Product.query.filter_by(sku=new_product.sku).first()

            # הוספה ל־low_stock_products אם צריך
            if saved_product and saved_product.stock_level < saved_product.low_stock_threshold:
                low_stock = LowStockProduct(
                    product_id=saved_product.id,
                    name=saved_product.name,
                    sku=saved_product.sku,
                    stock_level=saved_product.stock_level
                )
                db.session.add(low_stock)
                db.session.commit()  # ✅ שורה הכרחית!

            return jsonify(saved_product.to_dict()), 201
        except KeyError as e:
            return jsonify({"error": f"Missing field: {e}"}), 400

>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d

@app.route('/api/products/<int:product_id>', methods=['GET', 'PUT', 'DELETE'])
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)

    if request.method == 'GET':
        return jsonify(product.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        try:
            old_stock = product.stock_level
            new_stock = data.get('stock_level', old_stock)
            product.name = data['name']
            product.sku = data['sku']
            product.category = data.get('category')
            product.price = data.get('price')
            product.cost = data.get('cost')
            product.stock_level = new_stock
            product.low_stock_threshold = data.get('low_stock_threshold', product.low_stock_threshold)
<<<<<<< HEAD
            if new_stock != old_stock:
                db.session.add(RestockLog(product_id=product.id, quantity=new_stock - old_stock))
            if new_stock > product.low_stock_threshold:
                db.session.query(LowStockProduct).filter_by(product_id=product.id).delete()
            else:
                entry = LowStockProduct.query.filter_by(product_id=product.id).first()
                if entry:
                    entry.name = product.name
                    entry.sku = product.sku
                    entry.stock_level = product.stock_level
                else:
                    db.session.add(LowStockProduct(
                        product_id=product.id,
                        name=product.name,
                        sku=product.sku,
                        stock_level=product.stock_level
                    ))
=======

            if new_stock != old_stock:
                db.session.add(RestockLog(product_id=product.id, quantity=new_stock - old_stock))

            # ✅ ניהול טבלת low_stock_products
            if new_stock < product.low_stock_threshold:
                exists = LowStockProduct.query.filter_by(product_id=product.id).first()
                if not exists:
                    low_stock = LowStockProduct(
                        product_id=product.id,
                        name=product.name,
                        sku=product.sku,
                        stock_level=new_stock
                    )
                    db.session.add(low_stock)
            else:
                LowStockProduct.query.filter_by(product_id=product.id).delete()

>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
            db.session.commit()
            return jsonify(product.to_dict()), 200
        except KeyError as e:
            return jsonify({"error": f"Missing field: {e}"}), 400
<<<<<<< HEAD
    elif request.method == 'DELETE':
        RestockLog.query.filter_by(product_id=product.id).delete()
        db.session.query(LowStockProduct).filter_by(product_id=product.id).delete()
=======

    elif request.method == 'DELETE':
        RestockLog.query.filter_by(product_id=product.id).delete()
        LowStockProduct.query.filter_by(product_id=product.id).delete()
>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
        db.session.delete(product)
        db.session.commit()
        return jsonify({'result': True}), 204

<<<<<<< HEAD
=======
# -------------------- RESTOCK ROUTES --------------------
@app.route('/api/products/<int:product_id>/restock', methods=['POST'])
def restock_product(product_id):
    data = request.get_json()
    product = Product.query.get_or_404(product_id)

    try:
        quantity = data['quantity']
        product.stock_level += quantity

        db.session.add(product)
        db.session.add(RestockLog(product_id=product_id, quantity=quantity))

        # ✅ מחיקה אוטומטית מטבלת מלאי נמוך
        if product.stock_level >= product.low_stock_threshold:
            LowStockProduct.query.filter_by(product_id=product.id).delete()

        db.session.commit()
        return jsonify(product.to_dict()), 200
    except KeyError as e:
        return jsonify({"error": f"Missing field: {e}"}), 400

>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
@app.route('/api/restocks', methods=['GET'])
def get_restock_logs():
    logs = RestockLog.query.order_by(RestockLog.timestamp.desc()).limit(5).all()
    return jsonify([log.to_dict() for log in logs]), 200

<<<<<<< HEAD
@app.route('/api/products/low-stock', methods=['GET'])
def low_stock_products():
    entries = LowStockProduct.query.order_by(LowStockProduct.timestamp.desc()).all()
    return jsonify([entry.to_dict() for entry in entries]), 200
=======
# -------------------- LOW STOCK ROUTES --------------------
@app.route('/api/products/low-stock', methods=['GET'])
def low_stock_products():
    products = Product.query.all()
    low_stock = [
        product for product in products
        if product.stock_level < (product.low_stock_threshold or 10)
    ]
    return jsonify([product.to_dict() for product in low_stock]), 200
>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d

# -------------------- DASHBOARD ROUTES --------------------
@app.route('/api/dashboard/summary', methods=['GET'])
def dashboard_summary():
    products = Product.query.all()
    total_products = len(products)
    total_value = sum((p.price or 0) * (p.stock_level or 0) for p in products)
    low_stock_count = len([p for p in products if (p.stock_level or 0) < (p.low_stock_threshold or 10)])
<<<<<<< HEAD
    since = datetime.utcnow() - timedelta(days=1)
    restocks_count = RestockLog.query.filter(RestockLog.timestamp >= since).count()
=======

    since = datetime.utcnow() - timedelta(days=1)
    restocks_count = RestockLog.query.filter(RestockLog.timestamp >= since).count()

>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
    return jsonify({
        "totalProducts": total_products,
        "totalValue": total_value,
        "lowStockProducts": low_stock_count,
        "restocksPending": restocks_count
    }), 200

<<<<<<< HEAD
=======
# -------------------- ANALYTICS ROUTES --------------------
>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
@app.route('/api/analytics/inventory-trend', methods=['GET'])
def inventory_trend():
    today = datetime.utcnow().date()
    products = Product.query.all()
    trend_data = []
<<<<<<< HEAD
=======

>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
    for i in range(30):
        day = today - timedelta(days=29 - i)
        total_stock = sum(p.stock_level for p in products)
        trend_data.append({"date": day.isoformat(), "stock": total_stock})
    return jsonify(trend_data), 200

@app.route('/api/analytics/product-trend/<int:product_id>', methods=['GET'])
def product_trend(product_id):
    product = Product.query.get_or_404(product_id)
    today = datetime.utcnow().date()
    trends = [{"date": (today - timedelta(days=29 - i)).isoformat(), "stock": product.stock_level} for i in range(30)]
    return jsonify(trends), 200

@app.route('/api/analytics/metrics', methods=['GET'])
def inventory_metrics():
    today = datetime.utcnow().date()
    products = Product.query.all()
    result = []
    for product in products:
        current_stock = product.stock_level
        dates = [today - timedelta(days=i) for i in range(29, -1, -1)]
        stock_by_day = {date: current_stock for date in dates}
        logs = RestockLog.query.filter_by(product_id=product.id).order_by(RestockLog.timestamp.asc()).all()
        for log in logs:
            log_date = log.timestamp.date()
            for d in dates:
                if d < log_date:
                    stock_by_day[d] -= log.quantity
        stock_values = list(stock_by_day.values())
        min_stock = min(stock_values)
        max_stock = max(stock_values)
        first_stock = stock_values[0]
        change = current_stock - first_stock
        change_percent = round((change / first_stock) * 100, 1) if first_stock > 0 else "N/A"
        result.append({
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "currentStock": current_stock,
            "minStock": min_stock,
            "maxStock": max_stock,
            "changeAmount": change,
            "changePercent": f"{change_percent}%" if isinstance(change_percent, float) else "N/A"
        })
    return jsonify(result), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        result = db.session.execute(text("SELECT oid, datname FROM pg_database WHERE datname = current_database();"))
        for row in result:
            print("🧠 Flask DB OID:", row[0], "| Name:", row[1])
<<<<<<< HEAD
    app.run(host='0.0.0.0', port=5000)
=======
>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d

    app.run(host='0.0.0.0', port=5000, debug=True)
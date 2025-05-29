from flask import Flask, jsonify, request
from flask_cors import CORS
from .models import db, Product, RestockLog, LowStockProduct
from .app_config import Config
from datetime import datetime, timedelta
from sqlalchemy import text

# -------------------- APP INIT --------------------
app = Flask(__name__)
app.url_map.strict_slashes = False
app.config.from_object(Config)

print("✅ Connected to DB:", app.config['SQLALCHEMY_DATABASE_URI'])

CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

# -------------------- PRODUCTS ROUTES --------------------
@app.route('/api/products', methods=['GET', 'POST'])
def manage_products():
    if request.method == 'GET':
        products = Product.query.all()
        return jsonify([p.to_dict() for p in products]), 200

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

            db.session.commit()
            return jsonify(product.to_dict()), 200
        except KeyError as e:
            return jsonify({"error": f"Missing field: {e}"}), 400

    elif request.method == 'DELETE':
        RestockLog.query.filter_by(product_id=product.id).delete()
        LowStockProduct.query.filter_by(product_id=product.id).delete()
        db.session.delete(product)
        db.session.commit()
        return jsonify({'result': True}), 204

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

@app.route('/api/restocks', methods=['GET'])
def get_restock_logs():
    logs = RestockLog.query.order_by(RestockLog.timestamp.desc()).limit(5).all()
    return jsonify([log.to_dict() for log in logs]), 200

# -------------------- LOW STOCK ROUTES --------------------
@app.route('/api/products/low-stock', methods=['GET'])
def low_stock_products():
    products = Product.query.all()
    low_stock = [
        product for product in products
        if product.stock_level < (product.low_stock_threshold or 10)
    ]
    return jsonify([product.to_dict() for product in low_stock]), 200

# -------------------- DASHBOARD ROUTES --------------------
@app.route('/api/dashboard/summary', methods=['GET'])
def dashboard_summary():
    products = Product.query.all()
    total_products = len(products)
    total_value = sum((p.price or 0) * (p.stock_level or 0) for p in products)
    low_stock_count = len([p for p in products if (p.stock_level or 0) < (p.low_stock_threshold or 10)])

    since = datetime.utcnow() - timedelta(days=1)
    restocks_count = RestockLog.query.filter(RestockLog.timestamp >= since).count()

    return jsonify({
        "totalProducts": total_products,
        "totalValue": total_value,
        "lowStockProducts": low_stock_count,
        "restocksPending": restocks_count
    }), 200

# -------------------- ANALYTICS ROUTES --------------------
@app.route('/api/analytics/inventory-trend', methods=['GET'])
def inventory_trend():
    today = datetime.utcnow().date()
    products = Product.query.all()
    trend_data = []

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

# -------------------- MAIN --------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        result = db.session.execute(text("SELECT oid, datname FROM pg_database WHERE datname = current_database();"))
        for row in result:
            print("🧠 Flask DB OID:", row[0], "| Name:", row[1])

    app.run(host='0.0.0.0', port=5000, debug=True)
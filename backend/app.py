from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger

from src.routes.auth import auth_bp
from src.routes.products import products_bp

app = Flask(__name__)

CORS(app, supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)

@app.route('/')
def index():
    return jsonify({'status': True})

# if __name__ == '__main__':
#     app.run(debug=True)
# Para async:
# hypercorn app:app --reload

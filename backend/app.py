from flasgger import Swagger
from flask import Flask, jsonify
from flask_cors import CORS

from src.routes import blueprints

app = Flask(__name__)

CORS(app, supports_credentials=True)
swagger = Swagger(app)


for bp in blueprints:
    app.register_blueprint(bp)


@app.route('/')
def index():
    return jsonify({'status': True})


# if __name__ == '__main__':
#     app.run(debug=True)
# Para async:
# hypercorn app:app --reload

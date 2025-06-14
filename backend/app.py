from flasgger import Swagger
from flask import Flask, jsonify

from src.routes import blueprints

app = Flask(__name__)
swagger = Swagger(app)

for bp in blueprints:
    app.register_blueprint(bp)


@app.route('/')
async def index():
    return jsonify({'status': True})


# hypercorn app:app --reload

# if __name__ == '__main__':
#     app.run(debug=True)

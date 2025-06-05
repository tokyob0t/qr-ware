from flask import Flask, jsonify

from src.routes import blueprints

app = Flask(__name__)

for bp in blueprints:
    app.register_blueprint(bp)


@app.route('/')
def index():
    return jsonify({'status': True})


if __name__ == '__main__':
    app.run(debug=True)  # hypercorn app:app --reload

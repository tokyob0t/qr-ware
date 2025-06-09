from flask import jsonify


class Response:
    @staticmethod
    def success(message=None, data=None, status_code=200):
        payload = {'status': True}
        if message:
            payload['message'] = message
        if data:
            payload['data'] = data
        return jsonify(payload), status_code

    @staticmethod
    def error(message=None, errors=None, status_code=400):
        payload = {'status': False}
        if message:
            payload['message'] = message
        if errors:
            payload['errors'] = errors
        return jsonify(payload), status_code

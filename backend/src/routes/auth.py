import asyncio
from dataclasses import dataclass
from datetime import datetime

import bcrypt
from dataclasses_json import LetterCase, dataclass_json
from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from ..schemas import UserLoginPayload, UserRegisterPayload, UserRole
from ..supabase_client import get_connection

auth_bp = Blueprint('auth', __name__)


@dataclass_json(letter_case=LetterCase.SNAKE)
@dataclass
class UserData:
    email: str
    name: str
    password_hash: str
    role: UserRole = UserRole.OPERATOR
    created_at: str = datetime.utcnow().isoformat()


class AuthService:
    @staticmethod
    async def hash_password(password: str) -> str:
        hashed = await asyncio.to_thread(
            bcrypt.hashpw, password.encode(), bcrypt.gensalt()
        )
        return hashed.decode()

    async def verify_password(password: str, password_hash: str) -> bool:
        return await asyncio.to_thread(
            bcrypt.checkpw, password.encode(), password_hash.encode()
        )

    @staticmethod
    async def fetch_user(email: str) -> UserData | None:
        conn = await get_connection()
        response = (
            await conn.table('users').select('*').eq('email', email).execute()
        )

        if response.data:
            return UserData.from_dict(response[0])

    @staticmethod
    async def create_user(
        name: str, email: str, password: str, role: UserRole = UserRole.OPERATOR
    ) -> bool:
        password_hash = await AuthService.hash_password(password)
        user = UserData(
            name=name, email=email, password_hash=password_hash, role=role
        )

        conn = await get_connection()

        await conn.table('users').insert(user.to_dict()).execute()

        return True


@auth_bp.route('/register', methods=['POST'])
async def register():
    try:
        raw_data = request.get_json()
        data = UserRegisterPayload(**raw_data)
    except ValidationError as e:
        return jsonify({'status': False, 'errors': e.errors()}), 400
    except Exception:
        return jsonify({'status': False, 'message': 'Invalid JSON'}), 400

    if not await AuthService.fetch_user(data.email):
        return jsonify(
            {'status': False, 'message': 'Email already registered'}
        ), 400

    await AuthService.create_user(data.name, data.email, data.password)

    return jsonify(
        {'status': True, 'message': f'User {data.name} registered successfully'}
    )


@auth_bp.route('/login', methods=['POST'])
async def login():
    try:
        raw_data = request.get_json()
        data = UserLoginPayload(**raw_data)
    except ValidationError as e:
        return jsonify({'status': False, 'errors': e.errors()}), 400
    except Exception:
        return jsonify({'status': False, 'message': 'Invalid JSON'}), 400

    db_user = await AuthService.fetch_user(data.email)

    if not db_user:
        return jsonify(
            {'status': False, 'message': 'Email not registered'}
        ), 400

    # Todo:
    # Verify hash
    # Create token
    # Return token

    return jsonify({'status': True})

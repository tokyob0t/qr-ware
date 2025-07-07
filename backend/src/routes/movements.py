from flasgger import swag_from
from flask import Blueprint, g, request
from pydantic import ValidationError

from ..classes import Response as res
from ..schemas.movements import ProductMovementData, ProductMovementPayload
from ..supabase_client import get_connection

movements_bp = Blueprint('movements', __name__)


class MovementService:
    @staticmethod
    async def log_movement(payload: ProductMovementPayload) -> bool:
        conn = await get_connection()
        mov = ProductMovementData(**payload.dict())
        result = (
            await conn.table('product_movements')
            .insert(mov.to_dict())
            .execute()
        )
        return True

    @staticmethod
    async def fetch_all() -> list[ProductMovementData]:
        conn = await get_connection()
        response = (
            await conn.table('product_movements')
            .select('*')
            .order('timestamp', desc=True)
            .execute()
        )
        data = response.data or []
        return [ProductMovementData.from_dict(m) for m in data]


@swag_from('../../docs/movements/all.yml', methods=['GET'])
@swag_from('../../docs/movements/new.yml', methods=['POST'])
@movements_bp.route('/movements', methods=['GET', 'POST'])
@requires_roles(['OPERATOR', 'MANAGER', 'AUDITOR', 'ADMIN'])
async def movements():
    if request.method == 'GET':
        movements = await MovementService.fetch_all()
        return res.success(data=movements)

    # Validar rol
    if g.current_user.get('role') == 'AUDITOR':
        return res.error(
            'Forbidden: auditors cannot log movements', status_code=403
        )

    if request.method == 'POST':
        raw_data = request.get_json()

        try:
            data = ProductMovementPayload(**raw_data)
        except ValidationError as e:
            print(e.errors())
            return res.error(errors=e.errors())
        except Exception as e:
            return res.error(f'Invalid payload: {e}')

        if data.user_email != g.current_user.get('email'):
            return res.error('User email mismatch', status_code=403)

        success = await MovementService.log_movement(data)
        if not success:
            return res.error('Could not log movement', status_code=500)

        return res.success('Movement logged successfully')

    return res.error('Method not allowed', status_code=405)

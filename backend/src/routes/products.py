from flask import Blueprint, request

# from flask import g
from pydantic import ValidationError

from ..classes import Response as res
from ..decorators import requires_roles
from ..schemas import ProductData, ProductPayload
from ..supabase_client import get_connection

products_bp = Blueprint('products', __name__)


class ProductService:
    @staticmethod
    async def fetch_all() -> list[ProductData]:
        return await ProductService.fetch_by()

    @staticmethod
    async def fetch_by(**kwargs) -> list[ProductData]:
        conn = await get_connection()
        query = conn.table('products').select('*')

        for field, value in kwargs.items():
            query = query.eq(field, value)

        response = await query.execute()
        data = response.data or []
        return [ProductData(**p) for p in data]

    @staticmethod
    async def new_product(payload: ProductPayload):
        conn = await get_connection()
        prod = ProductData(**payload.dict())
        await conn.table('products').insert(prod.to_dict()).execute()
        return True


@products_bp.route('/products', methods=['GET', 'POST'])
@requires_roles(['OPERATOR', 'AUDITOR', 'MANAGER', 'ADMIN'])
async def products():
    if request.method == 'GET':
        arr = await ProductService.fetch_all()
        return res.success(data=arr)

    if request.method == 'POST':
        # Validar rol
        # if g.current_user.get('role') == 'AUDITOR':
        #     return res.error(
        #         'Forbidden: auditors cannot edit products', status_code=403
        #     )

        raw_data = request.get_json()

        try:
            data = ProductPayload(**raw_data)
        except ValidationError as e:
            return res.error(errors=e.errors())
        except Exception as e:
            return res.error(f'Invalid payload: {e}')

        await ProductService.new_product(data)
        return res.success(message='Product created successfully')

    return res.error('Method not allowed', status_code=405)


@requires_roles(['OPERATOR', 'AUDITOR', 'MANAGER', 'ADMIN'])
@products_bp.route('/products/<sku>', methods=['GET'])
async def product_by_sku(sku: str):
    products = await ProductService.fetch_by(sku=sku)
    if not products:
        return res.error(f'Product with SKU "{sku}" not found', status_code=404)
    return res.success(data=products[0])

from flasgger import swag_from
from flask import Blueprint, g, request

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
    async def update_product(sku: str, update_data: dict) -> bool:
        conn = await get_connection()

        existing = await ProductService.fetch_by(sku=sku)

        if len(existing) == 0:
            return False

        result = (
            await conn.table('products')
            .update(update_data)
            .eq('sku', sku)
            .execute()
        )

        return True

    @staticmethod
    async def delete_by_sku(sku: str) -> bool:
        conn = await get_connection()
        result = await conn.table('products').delete().eq('sku', sku).execute()
        return True

    @staticmethod
    async def new_product(payload: ProductPayload) -> bool:
        conn = await get_connection()
        prod = ProductData(**payload.dict())
        await conn.table('products').insert(prod.to_dict()).execute()
        return True


@swag_from('../../docs/products/all.yml', methods=['GET'])
@swag_from('../../docs/products/new.yml', methods=['POST'])
@products_bp.route('/products', methods=['GET', 'POST'])
@requires_roles(['OPERATOR', 'AUDITOR', 'MANAGER', 'ADMIN'])
async def products():
    if request.method == 'GET':
        arr = await ProductService.fetch_all()
        return res.success(data=arr)

    # Validar rol
    if g.current_user.get('role') == 'AUDITOR':
        return res.error(
            'Forbidden: auditors cannot edit products', status_code=403
        )

    if request.method == 'POST':
        raw_data = request.get_json()

        try:
            data = ProductPayload(**raw_data)
        except ValidationError as e:
            return res.error(errors=e.errors())
        except Exception as e:
            return res.error(f'Invalid payload: {e}')

        await ProductService.new_product(data)
        return res.success('Product created successfully')

    return res.error('Method not allowed', status_code=405)


@swag_from('../../docs/products/by_sku.yml', methods=['GET'])
@swag_from('../../docs/products/delete.yml', methods=['DELETE'])
@swag_from('../../docs/products/update.yml', methods=['PATCH'])
@products_bp.route('/products/<sku>', methods=['GET', 'DELETE', 'PATCH'])
@requires_roles(['OPERATOR', 'AUDITOR', 'MANAGER', 'ADMIN'])
async def product_by_sku(sku: str):
    if request.method == 'GET':
        products = await ProductService.fetch_by(sku=sku)
        if not products:
            return res.error(
                f'Product with SKU "{sku}" not found', status_code=404
            )
        return res.success(data=products[0])

    if g.current_user.get('role') == 'AUDITOR':
        return res.error(
            'Forbidden: auditors cannot edit products', status_code=403
        )

    if request.method == 'PATCH':
        raw_data = request.get_json()

        if 'sku' in raw_data:
            return res.error('SKU cannot be updated', status_code=400)

        try:
            update_data = ProductPayload(**raw_data).dict(exclude_unset=True)
        except ValidationError as e:
            return res.error(errors=e.errors())

        updated = await ProductService.update_product(
            sku=sku, update_data=update_data
        )

        if not updated:
            return res.error('Product cannot be updated', status_code=400)

        return res.success('Product updated successfully')

    if request.method == 'DELETE':
        deleted = await ProductService.delete_by_sku(sku=sku)
        if not deleted:
            return res.error(
                f'Product with SKU "{sku}" not found', status_code=404
            )
        return res.success('Product deleted successfully')

    return res.error('Method not allowed', status_code=405)

from .auth import auth_bp
from .movements import movements_bp
from .products import products_bp

__all__ = blueprints = [auth_bp, products_bp, movements_bp]

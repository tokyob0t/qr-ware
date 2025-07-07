from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from dataclasses_json import LetterCase, dataclass_json
from pydantic import BaseModel


class ProductPayload(BaseModel):
    sku: str
    name: str
    price: float
    stock: int
    is_active: bool = True
    barcode: Optional[str] = None

class ProductPatchPayload(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    barcode: Optional[str] = None

@dataclass_json(letter_case=LetterCase.SNAKE)
@dataclass
class ProductData:
    sku: str
    name: str
    price: float
    stock: int
    is_active: bool
    barcode: Optional[str] = None
    created_at: str = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )

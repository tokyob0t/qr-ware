from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional

from dataclasses_json import LetterCase, dataclass_json
from pydantic import BaseModel, EmailStr, validator


class MovementType(Enum):
    PRODUCT_CREATED = 'PRODUCT_CREATED'
    STOCK_ADDED = 'STOCK_ADDED'
    PRODUCT_DELETED = 'PRODUCT_DELETED'
    STOCK_REMOVED = 'STOCK_REMOVED'

    def to_string(self) -> str:
        return self.name

    @classmethod
    def from_string(cls, value: str) -> 'MovementType':
        return cls[value.upper()]

    def __str__(self):
        return self.to_string()

    def __repr__(self):
        return self.to_string()


class ProductMovementPayload(BaseModel):
    sku: str
    type: MovementType
    quantity: int
    user_email: EmailStr
    note: Optional[str] = None

    @validator('quantity')
    def quantity_validator(cls, v):
        if v <= 0:
            raise ValueError('quantity must be positive')
        return v


@dataclass_json(letter_case=LetterCase.SNAKE)
@dataclass
class ProductMovementData:
    timestamp: str = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )
    sku: str = ''
    type: str = ''
    quantity: int = 0
    user_email: str = ''
    note: Optional[str] = None

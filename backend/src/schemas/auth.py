from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

from dataclasses_json import LetterCase, dataclass_json
from pydantic import BaseModel, EmailStr


class UserRole(Enum):
    OPERATOR = 1
    AUDITOR = 2
    MANAGER = 3
    ADMIN = 4

    def to_string(self) -> str:
        return self.name

    @classmethod
    def from_string(cls, value: str) -> 'UserRole':
        return cls[value.upper()]

    def __str__(self):
        return self.to_string()

    def __repr__(self):
        return self.to_string()


class UserRegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = 'OPERATOR'


class UserLoginPayload(BaseModel):
    email: EmailStr
    password: str


@dataclass_json(letter_case=LetterCase.SNAKE)
@dataclass
class UserData:
    email: str
    name: str
    password_hash: str
    role: str = UserRole.OPERATOR.to_string()
    created_at: str = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )

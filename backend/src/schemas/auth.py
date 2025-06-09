from enum import Enum

from pydantic import BaseModel, EmailStr


class UserRegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLoginPayload(BaseModel):
    email: EmailStr
    password: str


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

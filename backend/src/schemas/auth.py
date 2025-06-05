from enum import Enum
from typing import TypedDict

from pydantic import BaseModel, EmailStr


class UserRegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLoginPayload(TypedDict):
    email: str
    password: str


class UserRole(Enum):
    ADMIN = 'ADMIN'
    MANAGER = 'MANAGER'
    AUDITOR = 'AUDITOR'
    OPERATOR = 'OPERATOR'

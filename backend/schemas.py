from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    password: str


class UserLogin(BaseModel):
    name: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    type: str  # "income" | "expense"
    category: str
    amount: float
    note: str | None = None
    date: str  # "YYYY-MM-DD"


class TransactionOut(BaseModel):
    id: int
    type: str
    category: str
    amount: float
    note: str | None
    date: str

    class Config:
        from_attributes = True

class PushTokenCreate(BaseModel):
    token: str

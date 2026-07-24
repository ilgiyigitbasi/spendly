from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, PushToken
from schemas import PushTokenCreate
from auth import get_current_user

router = APIRouter(prefix="/push", tags=["push"])


@router.post("/register")
def register_push_token(
    payload: PushTokenCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(PushToken).filter(PushToken.token == payload.token).first()
    if existing:
        existing.user_id = current_user.id  # token cihazda kalıp kullanıcı değişebilir, güncelle
    else:
        db.add(PushToken(user_id=current_user.id, token=payload.token))

    db.commit()
    return {"status": "registered"}
from notifications import send_push
from fastapi import APIRouter, Depends, HTTPException   
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
        existing.user_id = current_user.id 
    else:
        db.add(PushToken(user_id=current_user.id, token=payload.token))

    db.commit()
    return {"status": "registered"}

@router.post("/test")
def test_push_notification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tokens = [
        item.token
        for item in db.query(PushToken)
        .filter(PushToken.user_id == current_user.id)
        .all()
    ]

    if not tokens:
        raise HTTPException(
            status_code=404,
            detail="Bu kullanıcı için kayıtlı push token yok.",
        )

    expo_result = send_push(
        tokens,
        "Spendly test",
        "Push notification zinciri çalışıyor 🎉",
    )

    return {
        "token_count": len(tokens),
        "expo_result": expo_result,
    }
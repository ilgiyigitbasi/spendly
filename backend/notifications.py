import httpx
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Transaction, PushToken

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_push(
    tokens: list[str],
    title: str,
    body: str,
):
    if not tokens:
        print("Push gönderilmedi: kayıtlı token yok.")
        return []

    messages = [
        {
            "to": token,
            "title": title,
            "body": body,
            "sound": "default",
            "channelId": "default",
            "priority": "high",
        }
        for token in tokens
    ]

    with httpx.Client(timeout=15.0) as client:
        response = client.post(
            EXPO_PUSH_URL,
            json=messages,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        )

        print("Expo HTTP status:", response.status_code)
        print("Expo push response:", response.text)

        response.raise_for_status()

        return response.json()


def send_daily_reminders():
    db: Session = SessionLocal()
    try:
        today = datetime.utcnow().strftime("%Y-%m-%d")
        users = db.query(User).all()

        for user in users:
            has_transaction_today = (
                db.query(Transaction)
                .filter(Transaction.user_id == user.id, Transaction.date == today)
                .first()
            )
            if has_transaction_today:
                continue  # bugün zaten bir kayıt girmiş, hatırlatmaya gerek yok

            tokens = [pt.token for pt in db.query(PushToken).filter(PushToken.user_id == user.id).all()]
            send_push(tokens, "Spendly", "Bugün için henüz bir harcama girmedin, unutma!")
    finally:
        db.close()
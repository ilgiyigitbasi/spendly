from zoneinfo import ZoneInfo
from dotenv import load_dotenv
load_dotenv()
from apscheduler.schedulers.background import BackgroundScheduler
from notifications import send_daily_reminders
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth_router, transactions_router, push_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Spendly API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(transactions_router.router)
app.include_router(push_router.router)

ISTANBUL_TZ = ZoneInfo("Europe/Istanbul")

scheduler = BackgroundScheduler(
    timezone=ISTANBUL_TZ,
)

scheduler.add_job(
    send_daily_reminders,
    trigger="cron",
    hour="10,15,21",
    minute=0,
    id="daily_spend_reminders",
    replace_existing=True,
    coalesce=True,
    misfire_grace_time=3600,
)

scheduler.start()

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Spendly API çalışıyor"}


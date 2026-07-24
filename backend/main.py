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

scheduler = BackgroundScheduler()
scheduler.add_job(send_daily_reminders, "cron", hour=20, minute=0)  # her gün saat 20:00 (UTC!)

scheduler.start()

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Spendly API çalışıyor"}


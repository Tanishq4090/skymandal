from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT = os.environ.get('CONTACT_RECIPIENT', 'skymandal1961@gmail.com')

app = FastAPI(title="Surat Kshtriya Yuvak Mandal API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactSubmission(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=30)
    subject: Optional[str] = Field(None, max_length=160)
    message: str = Field(..., min_length=5, max_length=4000)


# ---------- Helpers ----------
def build_contact_email_html(payload: ContactSubmission) -> str:
    subj = payload.subject or "General Inquiry"
    phone = payload.phone or "—"
    safe_msg = (payload.message or "").replace("\n", "<br/>")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background:#FAF9F6; padding:24px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #E5E0D8; border-radius:8px; overflow:hidden;">
          <tr><td style="background:#A81A11; color:#ffffff; padding:20px 28px;">
            <h2 style="margin:0; font-family: Georgia, serif; font-weight:600;">Surat Kshtriya Yuvak Mandal</h2>
            <p style="margin:4px 0 0 0; font-size:13px; opacity:0.9;">New Contact Form Submission</p>
          </td></tr>
          <tr><td style="padding:28px;">
            <p style="margin:0 0 16px; color:#1A1A1A;"><strong>Name:</strong> {payload.name}</p>
            <p style="margin:0 0 16px; color:#1A1A1A;"><strong>Email:</strong> {payload.email}</p>
            <p style="margin:0 0 16px; color:#1A1A1A;"><strong>Phone:</strong> {phone}</p>
            <p style="margin:0 0 16px; color:#1A1A1A;"><strong>Subject:</strong> {subj}</p>
            <hr style="border:none; border-top:1px solid #E5E0D8; margin:20px 0;" />
            <p style="margin:0 0 8px; color:#4A4A4A; font-size:14px;"><strong>Message:</strong></p>
            <p style="margin:0; color:#1A1A1A; line-height:1.6;">{safe_msg}</p>
          </td></tr>
          <tr><td style="background:#F5F2EB; padding:16px 28px; color:#4A4A4A; font-size:12px;">
            Sent via the SKYM website contact form · {datetime.now(timezone.utc).strftime('%d %b %Y %H:%M UTC')}
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Surat Kshtriya Yuvak Mandal API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "resend_configured": bool(resend.api_key)}


@api_router.post("/contact")
async def submit_contact(payload: ContactSubmission):
    submission_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()

    doc = {
        "id": submission_id,
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "subject": payload.subject,
        "message": payload.message,
        "created_at": now_iso,
        "email_status": "pending",
    }

    email_id = None
    email_error = None

    if resend.api_key:
        params = {
            "from": SENDER_EMAIL,
            "to": [CONTACT_RECIPIENT],
            "reply_to": payload.email,
            "subject": f"[SKYM Contact] {payload.subject or 'New message from ' + payload.name}",
            "html": build_contact_email_html(payload),
        }
        try:
            result = await asyncio.to_thread(resend.Emails.send, params)
            email_id = result.get("id") if isinstance(result, dict) else None
            doc["email_status"] = "sent"
            doc["email_id"] = email_id
        except Exception as e:
            email_error = str(e)
            doc["email_status"] = "failed"
            doc["email_error"] = email_error
            logger.error(f"Resend send failed: {email_error}")
    else:
        doc["email_status"] = "skipped_no_key"

    try:
        await db.contact_submissions.insert_one(doc)
    except Exception as e:
        logger.error(f"Mongo insert failed: {e}")

    if email_error:
        # Still return 200 — message stored. Surface a soft warning.
        return {
            "status": "stored",
            "id": submission_id,
            "warning": "Message recorded but email delivery failed.",
        }

    return {"status": "success", "id": submission_id, "email_id": email_id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

#!/usr/bin/env python3
"""
JobSnap Email Dispatcher
Sends emails using Gmail API with authorization credentials from desktop ai_job_agent.
Outputs clean JSON status for consumption by Node.js backend.
"""

import os
import sys
import json
import base64
import pickle
import argparse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

TOKEN_PATHS = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "token.pickle"),
    r"c:\Users\musab\Desktop\ai_job_agent\token.pickle",
]

def get_gmail_service():
    from googleapiclient.discovery import build
    from google.auth.transport.requests import Request

    token_file = None
    for p in TOKEN_PATHS:
        if os.path.exists(p):
            token_file = p
            break

    if not token_file:
        raise FileNotFoundError(f"Gmail token.pickle not found in paths: {TOKEN_PATHS}")

    with open(token_file, "rb") as f:
        creds = pickle.load(f)

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(token_file, "wb") as f:
            pickle.dump(creds, f)

    return build("gmail", "v1", credentials=creds)

def send_email(to_email, subject, html_content, sender="me"):
    service = get_gmail_service()
    
    message = MIMEMultipart("alternative")
    message["to"] = to_email
    message["from"] = sender
    message["subject"] = subject

    part = MIMEText(html_content, "html", "utf-8")
    message.attach(part)

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    res = service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return res

def main():
    parser = argparse.ArgumentParser(description="Send email via Gmail API")
    parser.add_argument("--to", required=True, help="Recipient email address")
    parser.add_argument("--subject", required=True, help="Email subject line")
    parser.add_argument("--html-file", help="Path to file containing HTML body")
    parser.add_argument("--html", help="Inline HTML body")

    args = parser.parse_args()

    html_body = ""
    if args.html_file and os.path.exists(args.html_file):
        with open(args.html_file, "r", encoding="utf-8") as f:
            html_body = f.read()
    elif args.html:
        html_body = args.html
    else:
        print(json.dumps({"status": "error", "message": "No HTML content provided"}))
        sys.exit(1)

    try:
        result = send_email(args.to, args.subject, html_body)
        print(json.dumps({"status": "success", "id": result.get("id"), "to": args.to}))
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e), "to": args.to}))
        sys.exit(1)

if __name__ == "__main__":
    main()

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests
import datetime
import os

app = FastAPI()

# Static folders mount karo
app.mount("/assets", StaticFiles(directory="../assets"), name="assets")
app.mount("/css", StaticFiles(directory="../css"), name="css")
app.mount("/js", StaticFiles(directory="../js"), name="js")

CLIENT_ID = "1431810130843930765"
CLIENT_SECRET = "8Fk7jD2nE50yr3rrGvz_U7uKsrvuqklS"
REDIRECT_URI = "http://localhost:8000/callback"

DISCORD_API = "https://discord.com/api"


@app.get("/login")
def login():
    return RedirectResponse(
        f"{DISCORD_API}/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=identify%20email"
    )


@app.get("/callback")
def callback(code: str):

    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    token = requests.post(f"{DISCORD_API}/oauth2/token", data=data, headers=headers).json()
    access_token = token.get("access_token")

    user = requests.get(
        f"{DISCORD_API}/users/@me",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    created = get_created_date(user["id"])

    return {
        "id": user["id"],
        "username": user["username"],
        "email": user.get("email"),
        "created": created
    }


def get_created_date(user_id):
    timestamp = ((int(user_id) >> 22) + 1420070400000) / 1000
    return datetime.datetime.utcfromtimestamp(timestamp)
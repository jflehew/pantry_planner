import requests
import os
import base64

def get_kroger_token():
    client_id = os.getenv("KROGER_CLIENT_ID")
    client_secret = os.getenv("KROGER_CLIENT_SECRET")
    encoded_credentials = os.getenv('KROGER_CLIENT_ENCODED_CREDENTIALS')

    credentials = f"{client_id}:{client_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    response = requests.post(
        "https://api-ce.kroger.com/v1/connect/oauth2/token",
        headers={
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={
            "grant_type": "client_credentials",
            "scope": "product.compact"
        }
    )
    if response.ok:
        return response.json()["access_token"]
    else:
        print("Token error:", response.status_code, response.text)
        return None
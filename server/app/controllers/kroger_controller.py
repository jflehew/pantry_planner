import token
from flask import Blueprint, jsonify, request
from app.utils.kroger_auth import get_kroger_token
import requests

kroger_bp = Blueprint("kroger_bp", __name__, url_prefix='/api/kroger')

@kroger_bp.route("/stores/nearby/geolocation")
def get_nearby_stores_by_geoloaction():
    token = get_kroger_token()
    if not token:
        return jsonify({"error": "failed to authenitcate with Kroger API"}), 500
    
    lat = request.args.get("lat")
    long = request.args.get("long")

    response = requests.get(
        f"https://api-ce.kroger.com/v1/locations?filter.latLong.near={lat},{long}",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.json(), response.status_code

@kroger_bp.route("/stores/nearby/zipcode")
def get_nearby_stores_by_zipcode():
    token = get_kroger_token()
    if not token:
        return jsonify(({"error": "failed to authenticate with Kroger API"})), 500
    
    zipcode = request.args.get("zipcode")

    response = requests.get(
        f"https://api-ce.kroger.com/v1/locations?filter.zipCode.near={zipcode}",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(response)
    return response.json(), response.status_code
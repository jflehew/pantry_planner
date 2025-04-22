import token
from urllib import response
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
        f"https://api-ce.kroger.com/v1/locations",
        headers={"Authorization": f"Bearer {token}"},
        params={"filter.latLong.near": f"{lat},{long}"}
    )
    return response.json(), response.status_code

@kroger_bp.route("/stores/nearby/zipcode")
def get_nearby_stores_by_zipcode():
    token = get_kroger_token()
    if not token:
        return jsonify(({"error": "failed to authenticate with Kroger API"})), 500
    
    zipcode = request.args.get("zipcode")

    response = requests.get(
        f"https://api-ce.kroger.com/v1/locations",
        headers={"Authorization": f"Bearer {token}"},
        params={"filter.zipCode.near" : zipcode}
    )
    return response.json(), response.status_code

@kroger_bp.route("/products/name/storelocation")
def get_products_by_name_and_brand():
    token = get_kroger_token()
    if not token:
        return jsonify(({"error": "failed to authenticate with Kroger API"})), 500
    
    locationId = request.args.get("locationId")
    term = request.args.get("term")
    print(locationId)

    response = requests.get(
        f"https://api-ce.kroger.com/v1/products",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "filter.locationId": locationId,
            "filter.term": term,
            "filter.limit": 25
        }
    )
    return response.json(), response.status_code

@kroger_bp.route("/products/brand/storelocation")
def get_products_by_name():
    token = get_kroger_token()
    if not token:
        return jsonify(({"error": "failed to authenticate with Kroger API"})), 500
    
    locationId = request.args.get("locationId")
    term = request.args.get("term")
    brand = request.args.get("brand")

    response = requests.get(
        f"https://api-ce.kroger.com/v1/products",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "filter.locationId": locationId,
            "filter.term": term,
            "filter.brand": brand,
            "filter.limit": 25
        }
    )

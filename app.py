# /usr/local/bin/python3

from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient()


@app.route("/")
def hello():
    db = client.crypto

    import requests

    url = "https://bittrex.com/api/v1.1/public/getmarkets"

    response = requests.request("GET", url)

    return "markets: "+str(response.text)

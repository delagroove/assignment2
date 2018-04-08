from app import create_app
from flask_socketio import send  # , emit
from pymongo import MongoClient
import requests
import json
from bson import json_util
from collections import namedtuple

socketio, app = create_app()
db = None

def _json_object_hook(d): return namedtuple('X', d.keys())(*d.values())
def json2obj(data): return json.loads(data, object_hook=_json_object_hook)

@socketio.on('connect')
def connect():
    client = MongoClient(port=27017)
    db = client.crypto
    send('connected')
    return 'connected'


@socketio.on('coin-list')
def coinList():
    res = requests.get('https://min-api.cryptocompare.com/data/all/coinlist')
    res_json = [x for x in res.json()['Data'].values() if int(x['SortOrder']) < 100]
    newlist = sorted(res_json, key=lambda k: k['SortOrder'])
    return newlist


@socketio.on('select-coin')
def selectCoin(thecoin):
    res = requests.get("https://min-api.cryptocompare.com/data/histoday?fsym="+thecoin+"&tsym=USD&limit=100")
    return res.text


@socketio.on('query-bank')
def queryBank():
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.settings.find_one()
    return json.dumps(result, sort_keys=True, indent=4, default=json_util.default)

@socketio.on('bank-add')
def bankAdd(amount):
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.settings.find_one()
    res = json.dumps(result, sort_keys=True, indent=4, default=json_util.default)
    result_json = json.loads(res)
    result_json['cash'] = result_json['cash'] + amount
    print(result_json['cash'])
    result = db.settings.update_one({}, {"$set": {"cash": result_json['cash']}})
    return result_json['cash']

@socketio.on('bank-remove')
def bankRemove(amount):
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.settings.find_one()
    res = json.dumps(result, sort_keys=True, indent=4, default=json_util.default)
    result_json = json.loads(res)
    result_json['cash'] = result_json['cash'] - amount
    print(result_json['cash'])
    result = db.settings.update_one({}, {"$set": {"cash": result_json['cash']}})
    return result_json['cash']

@socketio.on('set-buy')
def setBuy(values):
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.orders.insert(values)
    return json.dumps(result, sort_keys=True, indent=4, default=json_util.default)


@socketio.on('set-sell')
def setSell(values):
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.orders.insert(values)
    return json.dumps(result, sort_keys=True, indent=4, default=json_util.default)


@socketio.on('get-blotter')
def getBlotter():
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.orders.find()
    return json.dumps(list(result), sort_keys=True, indent=4, default=json_util.default)


@socketio.on('get-pl')
def getPl(coin):
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.orders.find()
    return json.dumps(list(result), sort_keys=True, indent=4, default=json_util.default)


@socketio.on('query-portfolio')
def queryPortfolio(coin):
    client = MongoClient(port=27017)
    db = client.crypto
    result = db.orders.find({"symbol": coin})
    return json.dumps(list(result), sort_keys=True, indent=4, default=json_util.default)


if __name__ == '__main__':
    socketio.run(app)


def num_shares(trades, symbol):
    shares = 0
    for trade in trades:

        if trade.side == 'BUY' and trade.symbol == symbol:
            shares += int(trade.quantity)
        if trade.side == 'SELL' and trade.symbol == symbol:
            shares -= int(trade.quantity)
    return shares


def sold_shares(trades, symbol):
    shares = 0
    for trade in trades:
        if trade.side == 'SELL' and trade.symbol == symbol:
            shares += int(trade.quantity)
    return shares


def pl(market, the_wap, shares):
    return float((market-the_wap)*int(shares))


def wap(trades, symbol):
    the_wap = 0
    acum = 0
    for trade in trades:
        if trade.side == 'BUY' and trade.symbol == symbol:
            the_wap += int(trade.quantity)*trade.price
            acum += int(trade.quantity)
    if acum > 0:
        return float(the_wap/acum)
    else:
        return float(0.00)

from app import create_app
from flask_socketio import send  # , emit
import requests

socketio, app = create_app()


@socketio.on('connect')
def connected():
    send('connected')
    return 'connected'


@socketio.on('coin-list')
def coinlist():
    res = requests.get('https://min-api.cryptocompare.com/data/all/coinlist')
    res_json = [x for x in res.json()['Data'].values() if int(x['SortOrder']) < 100]
    newlist = sorted(res_json, key=lambda k: k['SortOrder'])
    return newlist


@socketio.on('select-coin')
def selectcoin(thecoin):
    res = requests.get("https://min-api.cryptocompare.com/data/histoday?fsym="+thecoin+"&tsym=USD&limit=100")
    return res.text


if __name__ == '__main__':
    socketio.run(app)

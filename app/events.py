from flask_socketio import send, emit
from flask import current_app, request

import os, uuid, json

@socketio.on('connect')
def connected():
    print ("%s connected")
    print("A")

@socketio.on('message')
def ticker():
    #print "%s disconnected" % (request.sid)
    emit('SubAdd', {subs: ['0~Poloniex~BTC~USD']});
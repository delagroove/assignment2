from flask_socketio import SocketIO
from flask import Flask
from app.config import DevelopmentConfig


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    from app.views import app as application
    app.register_blueprint(application)
    socketio = SocketIO(app)
    #socketio.init_app(app)
    return socketio, app

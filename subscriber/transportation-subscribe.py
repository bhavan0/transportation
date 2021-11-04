from flask import Flask
from flask_restful import Api, request
from flask_cors import CORS
from flask_socketio import SocketIO
from redis import Redis
import time
import threading
import os
import requests
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode='threading', cors_allowed_origins='*')
api = Api(app)
CORS(app)
rediHost = os.environ["redis-host"]
hostPort = os.environ["host-port"]
Redis_Client = Redis(rediHost, 6379)
tasks = {}
threadIds = {}


@socketio.on('user')
def get(userName):
    # Socket Open when user requests for the subscribed data
    global tasks
    global threadIds
    # Create a new thread for each user request, helps in showing multiple users display
    task = threading.Thread(
        target=userSubscribedVehicleLocations, args=(userName, request.namespace))
    task.daemon = False
    tasks[userName] = task
    task.start()
    threadIds[userName] = task.ident


@socketio.on('disconnect-client')
def disconnect(userName):
    global tasks
    global threadIds

    # Call a random broker and let it know user logged out, broker removes user from the hash table
    num = random.randint(1, 3)
    requests.get(
        f'http://broker{num}:700{num}/remove-user-from-hash?userName={userName}')

    # Clear out the websocket and the thread created once user disconnects from the page
    task = tasks.pop(userName)
    threadIds.pop(userName)
    task.join()


def userSubscribedVehicleLocations(userName, namespace):
    global threadIds

    # Call random broker to let it know user has logged in and to add user to the hash table
    num = random.randint(1, 3)
    requests.get(
        f'http://broker{num}:700{num}/add-user-to-hash?userName={userName}')

    time.sleep(1)
    modPublishNameSpace = userName + '-mod-publised'
    # Start reading the redis list of the user logged to see if any new data is pushed by the moderator
    while True:
        if threading.get_ident() not in threadIds.values():
            break
        msg = Redis_Client.rpop(modPublishNameSpace)
        if msg is None:
            time.sleep(5)
            continue

        handlerNew(userName, msg, namespace)


def handlerNew(userName, data, namespace):
    # Push the fetched data from the broker to the client through websocket
    jsonResponse = data.decode('ascii')

    name = userName + '-res'
    socketio.emit(name, jsonResponse, namespace=namespace)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=hostPort)

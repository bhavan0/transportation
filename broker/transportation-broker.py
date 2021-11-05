from flask import Flask
from flask_restful import Resource, Api, request, reqparse
from flask_cors import CORS
from flask_socketio import SocketIO
from bson import json_util
from redis import Redis
from database_connection import get_database
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode='threading', cors_allowed_origins='*')
api = Api(app)
CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])
clients = []
host = os.environ["redis-host"]
hostPort = os.environ["host-port"]
Redis_Client = Redis(host, 6379)
usersLoggedInHashTableName = 'usersLoggedInHashTableName'


class Broker(Resource):

    # Called by the publishers to add data to the db and push data to the subscribers
    @app.route('/publish', methods=['POST'])
    def publish():
        # Read parameter data
        vehicles = request.get_json()
        publishedVehicleIds = []

        # Add published data to the respective tables in the DB
        for vehicle in vehicles:
            vehiclesDb = get_database('vehicles')
            vehicleId = vehicle['vehicleId']
            publishedVehicleIds.append(vehicleId)
            collection_vehicleId = vehiclesDb[vehicleId]
            collection_vehicleId.insert_one(vehicle)

        # Loop through hash table to check all users logged in
        for key, value in Redis_Client.hgetall(usersLoggedInHashTableName).items():
            # Hash table saves data in bytecode hence need to decode
            userName = key.decode("utf-8")
            subscribedBuses = value.decode("utf-8")

            allBusIds = subscribedBuses.split(',')
            subscribedBusesOfUser = list(
                set(publishedVehicleIds) & set(allBusIds))

            # Only if the user has subscribed to any of the buses push it to the user Queue
            # TODO: Use the data present above itself
            if len(subscribedBusesOfUser) > 0:

                busResponse = [
                    x for x in vehicles if x['vehicleId'] in subscribedBusesOfUser]

                publishNameSpace = userName + '-mod-publised'

                # Add the latest user subscriptions to the respective user queue lists
                Redis_Client.rpush(
                    publishNameSpace, json_util.dumps(busResponse))

        return 'published', 200

    # Adds the subscriptions added by the user to the Db
    @app.route('/add-user-subscription', methods=['POST'])
    def addUserSubscriptions():
        userRequest = request.get_json()
        userName = userRequest['userName']
        newUserSubscribedBuses = userRequest['subscribedBuses'].split(',')

        userDb = get_database('user')
        collection_subscriptions = userDb['subscriptions']

        userData = collection_subscriptions.find_one({"userName": userName})

        subscribedBuses = userData['subscribedBuses']
        currentSubscribedBuses = subscribedBuses.split(',')

        newSubscriptionList = list(set().union(
            currentSubscribedBuses, newUserSubscribedBuses))

        newSubscriptionList = filter(None, newSubscriptionList)

        new = ','.join(newSubscriptionList)

        collection_subscriptions.update_one({"_id": userData['_id']}, {
                                            "$set": {"subscribedBuses": new}})

        return 'updated', 200

    # Removes the subscriptions removed by the user from the DB and then from the Hash Table
    @app.route('/remove-user-subscription', methods=['POST'])
    def removeUserSubscriptions():
        userRequest = request.get_json()
        userName = userRequest['userName']
        unSubscribedBuses = userRequest['subscribedBuses'].split(',')

        userDb = get_database('user')
        collection_subscriptions = userDb['subscriptions']

        userData = collection_subscriptions.find_one({"userName": userName})

        subscribedBuses = userData['subscribedBuses']
        currentSubscribedBuses = subscribedBuses.split(',')

        latestSubscribedBuses = [
            x for x in currentSubscribedBuses if x not in unSubscribedBuses]

        new = ','.join(latestSubscribedBuses)

        collection_subscriptions.update_one({"_id": userData['_id']}, {
                                            "$set": {"subscribedBuses": new}})

        Broker.updateHashTableOfUserSubscription(userName, new)

        return 'updated', 200

    # Add logged in user to the Hashtable
    @app.route('/add-user-to-hash', methods=['GET'])
    def addUserLoggedIntoHashTable():
        parser = reqparse.RequestParser()
        parser.add_argument('userName', required=True)
        args = parser.parse_args()

        userName = args['userName']

        userDb = get_database('user')
        collection_subscriptions = userDb['subscriptions']

        userData = collection_subscriptions.find_one({"userName": userName})
        subscribedBuses = userData['subscribedBuses']

        Redis_Client.hset(
            usersLoggedInHashTableName, userName, subscribedBuses)

        return 'added', 200

    # Remove logged out user from the Hash table
    @app.route('/remove-user-from-hash', methods=['GET'])
    def removeUserFromHashTable():
        parser = reqparse.RequestParser()
        parser.add_argument('userName', required=True)
        args = parser.parse_args()

        userName = args['userName']

        Redis_Client.hdel(
            usersLoggedInHashTableName, userName)

        return 'removed', 200

    # Used to update the user subscribed buses in the hash table
    def updateHashTableOfUserSubscription(userName, busList):
        publishNameSpace = userName + '-mod-publised'
        Redis_Client.ltrim(publishNameSpace, 999, 0)

        Redis_Client.hset(
            usersLoggedInHashTableName, userName, busList)


api.add_resource(Broker, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=hostPort)

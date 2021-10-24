from flask import Flask
from flask_restful import Resource, Api, request
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
Redis_Client = Redis(host, 6379)


class Mediator(Resource):

    # Called by the publishers to add data to the db and push data to the subscribers
    @app.route('/publish', methods=['POST'])
    def publish():
        # Read parameter data
        vehicles = request.get_json()
        publishedVehicleIds = []
        for vehicle in vehicles:
            vehiclesDb = get_database('vehicles')
            vehicleId = vehicle['vehicleId']
            publishedVehicleIds.append(vehicleId)
            collection_vehicleId = vehiclesDb[vehicleId]
            collection_vehicleId.insert_one(vehicle)

        userDb = get_database('user')
        collection_subscriptions = userDb['subscriptions']
        for user in collection_subscriptions.find():

            subscribedBuses = user['subscribedBuses']
            allBusIds = subscribedBuses.split(',')
            if not set(publishedVehicleIds).isdisjoint(allBusIds):

                busResponse = Mediator.getUserSubscribedBusesFromDb(
                    allBusIds)
                publishNameSpace = user['userName'] + '-mod-publised'


                # Add the latest user subscriptions to the respective user queue lists
                Redis_Client.ltrim(publishNameSpace, 99, 0)
                Redis_Client.rpush(
                    publishNameSpace, json_util.dumps(busResponse))

        return 'published', 200

    def getUserSubscribedBusesFromDb(busIds):
        busesResponse = []
        busesDb = get_database('vehicles')
        for busId in busIds:
            busLatestDb = busesDb[busId].find().sort(
                [('timestamp', -1)]).limit(1)
            busLatestDb = list(busLatestDb)
            if busLatestDb:
                busLatest = list(busLatestDb)[-1]
            busesResponse.append({
                "vehicleId": busLatest['vehicleId'],
                "latitude": busLatest['latitude'],
                "longitude": busLatest['longitude'],
                "routeId": busLatest['routeId'],
                "patternId": busLatest['patternId'],
                "destination": busLatest['destination'],
                "distance": busLatest['distance'],
                "delay": busLatest['delay']
            })

        return {'buses': json_util.dumps(busesResponse)}

    # Adds the subscriptions added by the user
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

    # Removes the subscriptions removed by the user
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

        collection_subscriptions.update_one({"_id": userData['_id']}, {
                                            "$set": {"subscribedBuses": latestSubscribedBuses}})

        return 'updated', 200


api.add_resource(Mediator, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000)

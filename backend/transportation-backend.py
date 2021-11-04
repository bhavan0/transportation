from flask import Flask
from flask_restful import Resource, Api, reqparse, request
from flask_cors import CORS
from flask_caching import Cache
from bson import json_util
from fetch_stops import getAllStops
from fetch_routes import getAllRoutes
from fetch_predictions import getPredictionsForStop
from fetch_vehicle_locations import getVehiclesLocation
from database_connection import get_database
import requests
import json
import random

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 10000
}

app = Flask(__name__)
app.config.from_mapping(config)
app.config['SECRET_KEY'] = 'secret!'
cache = Cache(app)
api = Api(app)
CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])

# Used for phase 1 display
class Buses(Resource):

    file_name = "bus.json"

    def get(self):
        # Open and fetch data from json file
        file = open(self.file_name, "r")
        data = json.load(file)
        return {'buses': data}, 200

    def post(self):
        # Read parameter data
        parser = reqparse.RequestParser()
        parser.add_argument('number', required=True)
        parser.add_argument('name', required=True)
        args = parser.parse_args()

        # Open json file
        with open(self.file_name, 'r+') as fp:
            json_data = json.load(fp)

            # Add value to json file
            json_data.append({
                "number": args['number'],
                "name": args['name']
            })
            fp.seek(0)
            json.dump(json_data, fp, indent=4)

        return True, 200

    def put(self):
        # Read parameter data
        parser = reqparse.RequestParser()
        parser.add_argument('number', required=True)
        parser.add_argument('name', required=True)
        args = parser.parse_args()

        # Open json file
        with open(self.file_name, 'r+') as fp:
            json_data = json.load(fp)
            fp.seek(0)

            # Check if bus number exists, if doesnt exist throw error
            if any(x['number'] == args['number'] for x in json_data):
                # select the bus
                user_data = next(
                    x for x in json_data if x['number'] == args['number'])

                # update bus name
                user_data['name'] = args['name']

                # Write into file updated data
                json.dump(json_data, fp, indent=4)
                # return data and 200 OK
                return True, 200

            else:
                # otherwise the bus number does not exist
                return {
                    'message': f"'{args['number']}' bus not found."
                }, 404

    def delete(self):
        # Read parameter data
        parser = reqparse.RequestParser()
        parser.add_argument('number', required=True)
        args = parser.parse_args()

        # Open json file
        with open(self.file_name, 'r') as fp:
            json_data = json.load(fp)
            fp.seek(0)

            # Check if bus number exists, if doesnt exist throw error
            if any(x['number'] == args['number'] for x in json_data):
                # filter list by removing selected bus
                updated_json_data = [
                    x for x in json_data if x['number'] != args['number']]

                # Overwrite json file with new data
                with open('bus.json', 'w') as fp2:
                    json.dump(updated_json_data, fp2, indent=4)

                # return data and 200 OK
                return {'buses': updated_json_data}, 200

            else:
                # otherwise the bus number does not exist
                return {
                    'message': f"'{args['number']}' bus not found."
                }, 404


class Stops(Resource):
    # Cache the Stops response after first call, its a huge data to fetch every time
    @cache.cached(timeout=5000, key_prefix='allStops')
    def get(self):
        stops = getAllStops()
        stops = json.loads(json_util.dumps(stops))
        return {'stops': stops}, 200


class Routes(Resource):
    # Cache the Routes response after first call, its a huge data to fetch every time
    @cache.cached(timeout=5000, key_prefix='allRoutes')
    def get(self):
        routes = getAllRoutes()
        routes = json.loads(json_util.dumps(routes))
        return {'routes': routes}, 200


class Predictions(Resource):
    # Get the buses which are near by the stop
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('stopId', required=True)
        args = parser.parse_args()

        predictions = getPredictionsForStop(args['stopId'])

        return {'predictions': predictions}, 200


class Vehicle(Resource):
    # Get the vehicle information based on Id
    def get(self):
        # Read parameter data
        parser = reqparse.RequestParser()
        parser.add_argument('vid', required=True)
        args = parser.parse_args()
        vehicleIds = args['vid']

        locations = getVehiclesLocation(vehicleIds)
        return {'locations': locations}, 200


class User(Resource):
    # Get all the subscribed vehicles info based on user subscription
    # Note: If the bus data is not available from the external API it ignores the bus
    @app.route('/user/subscribed-vehicles', methods=['GET'])
    def getUserSubscribedVehicles():
        parser = reqparse.RequestParser()
        parser.add_argument('userName', required=True)
        args = parser.parse_args()

        userName = args['userName']
        userDb = get_database('user')
        collection_subscriptions = userDb['subscriptions']

        userData = collection_subscriptions.find_one({"userName": userName})
        subscribedBuses = userData['subscribedBuses']

        locations = getVehiclesLocation(subscribedBuses)
        return {'locations': locations}, 200

    # Add the user to the DB, if it doesnt exist
    @app.route('/user/add', methods=['GET'])
    def addIfDoesntExistUser():
        parser = reqparse.RequestParser()
        parser.add_argument('userName', required=True)
        args = parser.parse_args()

        userName = args['userName']
        userDb = get_database('user')
        collection_subscriptions = userDb['subscriptions']

        if collection_subscriptions.count_documents({'userName': userName}, limit=1) != 0:
            return {'sucess': 'user exists'}, 200
        else:
            user = {'userName': userName, 'subscribedBuses': ''}
            collection_subscriptions.insert_one(user)

        return {'sucess': 'added user'}, 200

    # Add User subscriptions to the DB
    @app.route('/user/add-subscription', methods=['POST'])
    def addUserSubscriptions():
        userRequest = request.get_json()

        num = random.randint(1, 3)
        requests.post(
            f'http://broker{num}:700{num}/add-user-subscription', json=userRequest)

        return {'sucess': 'added subscription'}, 200

    # Remove user unsubscribed buses from the DB
    @app.route('/user/remove-subscription', methods=['POST'])
    def removeUserSubscriptions():
        userRequest = request.get_json()

        num = random.randint(1, 3)
        requests.post(
            f'http://broker{num}:700{num}/remove-user-subscription', json=userRequest)

        return {'sucess': 'removed subscription'}, 200


api.add_resource(Buses, '/buses')  # add endpoints
api.add_resource(Stops, '/stops')
api.add_resource(Routes, '/routes')
api.add_resource(Vehicle, '/vehicles')
api.add_resource(Predictions, '/predictions')
api.add_resource(User, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # run our Flask app

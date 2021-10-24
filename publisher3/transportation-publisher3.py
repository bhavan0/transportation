from flask import Flask
from flask_restful import Api
from apscheduler.schedulers.background import BackgroundScheduler
from fetch_vehicle_locations import getVehiclesLocation
from database_connection import get_database
import requests


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
api = Api(app)
vehicleIds = []


def publishAllBuses():
    # Fetch data from the External API and publish it to the mediator/broker

    print('start publish')
    userDb = get_database('user')
    collection_subscriptions = userDb['subscriptions']
    allSubscribedBuses = collection_subscriptions.find(
        {}, {'subscribedBuses': 1, '_id': 0})

    allSubscribedBusesList = list(allSubscribedBuses)

    allBusesIds = []
    for temp in allSubscribedBusesList:
        allBusesIds = list(set().union(
            allBusesIds, temp['subscribedBuses'].split(',')))

    final = [allBusesIds[i:i + 5]
             for i in range(0, len(allBusesIds), 5)]

    # Get and publish only the 10-. buses present in the DB
    if len(final) > 2:
        for ids in final[2:]:
            idsTemp = ','.join(ids)
            locations = getVehiclesLocation(idsTemp)
            print('publishing')
            requests.post(
                f'http://app-mediator:7000/publish', json=locations)


if __name__ == '__main__':
    sched = BackgroundScheduler(daemon=True)
    # Run the publish methos every 1.2 minute interval
    sched.add_job(publishAllBuses, 'interval', minutes=1.2)
    sched.start()
    app.run(host='0.0.0.0', port=6001)

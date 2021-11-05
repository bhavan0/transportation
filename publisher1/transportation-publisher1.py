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
    # Fetch data from the External API and publish it to the broker
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

    allBusesIds.sort(key=float)
    
    final = [allBusesIds[i:i + 3]
             for i in range(0, len(allBusesIds), 3)]

    # Get and publish only the first 3 buses present in the DB
    if len(final) > 0:
        ids = final[0]
        idsTemp = ','.join(ids)
        locations = getVehiclesLocation(idsTemp)

        if len(locations) > 0:
            print('publishing')
            requests.post(
                f'http://broker1:7001/publish', json=locations)


if __name__ == '__main__':
    sched = BackgroundScheduler(daemon=True)
    # Run the publish methos every 1 minute interval
    sched.add_job(publishAllBuses, 'interval', minutes=1)
    sched.start()
    app.run(host='0.0.0.0', port=6001)

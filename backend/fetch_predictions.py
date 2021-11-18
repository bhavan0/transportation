import requests
import json
from bson import json_util


def getPredictionsForStop(stopId):

    preditictionResult = []

    try:
        response = requests.get(
            f'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=AP7DKXnggE5xShwG85HjQxzLu&stpid={stopId}&format=json')
        jsonResponse = json.loads(json_util.dumps(response.json()))
        predictions = jsonResponse['bustime-response']['prd']

        for pred in predictions:
            preditictionResult.append({
                "stopId": pred['stpid'],
                "vehicleId": pred['vid'],
                "distance": pred['dstp'],
                "routeId": pred['rt'],
                "routeDirection": pred['rtdir'],
                "destination": pred['des'],
                "type": pred['typ']
            })

    except:
        print('data not available')

    return preditictionResult

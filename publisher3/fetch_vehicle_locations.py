import requests
import json
from bson import json_util


def getVehiclesLocation(vehicleIds):
    preditictionResult = []

    try:
        response = requests.get(
            f'http://www.ctabustracker.com/bustime/api/v2/getvehicles?key=AP7DKXnggE5xShwG85HjQxzLu&vid={vehicleIds}&format=json')
        jsonResponse = json.loads(json_util.dumps(response.json()))
        predictions = jsonResponse['bustime-response']['vehicle']
        
        for pred in predictions:
            preditictionResult.append({
                "vehicleId": pred['vid'],
                "latitude": pred['lat'],
                "longitude": pred['lon'],
                "routeId": pred['rt'],
                "patternId": pred['pid'],
                "destination": pred['des'],
                "distance": pred['pdist'],
                "delay": pred['dly']
            })
    except:
        print('data not available')

    return preditictionResult

from database_connection import get_database

def getAllStops():
    dbName = get_database('transportation')
    collectionName = dbName["stops"]
    allStops = collectionName.find(
        {}, {'stop_id': 1, 'stop_name': 1, 'stop_desc': 1, 'stop_lat': 1, 'stop_lon': 1, '_id': 0})
    allStopsList = list(allStops)

    allStopsResult = []
    for stop in allStopsList:
        allStopsResult.append({
                "stopId": stop['stop_id'],
                "name": stop['stop_name'],
                "desc": stop['stop_desc'],
                "latitude": stop['stop_lat'], 
                "longitude": stop['stop_lon'],
            })

    return allStopsResult

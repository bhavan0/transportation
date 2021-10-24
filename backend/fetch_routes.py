from database_connection import get_database

def getAllRoutes():
    dbName = get_database('transportation')
    collectionName = dbName["routes"]
    allRoutes = collectionName.find(
        {}, {'route_id': 1, 'route_long_name': 1,'_id': 0})

    allStopsList = list(allRoutes)

    allRoutesResult = []
    for stop in allStopsList:
        allRoutesResult.append({
                "routeId": stop['route_id'],
                "name": stop['route_long_name']
            })

    return allRoutesResult

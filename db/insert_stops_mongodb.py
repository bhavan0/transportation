from database_connection import get_database

file_content = []


def extractStop(line):
    """
    Returns a list of 9 elements extracted from the
    string line.  Missing data are replaced by '0'.
    """
    result = []
    strd = line.split('\"')  # extract strings first
    (name, desc) = (strd[1], strd[3])
    data = strd[0].split(',')
    result.append('0' if data[0] == '' else data[0])
    result.append('0' if data[1] == '' else data[1])
    result.append(name)
    result.append(desc)
    data = strd[4].split('\n')  # remove newline
    data = data[0].split(',')
    for k in range(1, len(data)):
        result.append('0' if data[k] == '' else data[k])
    while len(result) < 9:
        result.append('0')
    return result


def runStops():
    with open("stops.txt") as fl:
        for line in fl:
            # stop_id, stop_code, stop_name, stop_desc, stop_lat, stop_lon, location_type, parent_station, wheelchair_boarding
            res = extractStop(line)
            file_content.append({"stop_id": res[0], "stop_code": res[1], "stop_name": res[2], "stop_desc": res[3], "stop_lat": res[4],
                                "stop_lon": res[5], "location_type": res[6], "parent_station": res[7], "wheelchair_boarding": res[8]})

    dbname = get_database('transportation')
    collection_name = dbname["stops"]
    collection_name.insert_many(file_content)

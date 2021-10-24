from database_connection import get_database

file_content = []


def extractRoute(line):
    """
    Returns a list of 7 elements extracted from the string line.
    """
    result = []
    strd = line.split('\"')  # extract strings first
    data = strd[0].split(',')
    result.append(data[0])
    result.append(strd[1])
    result.append(strd[3])
    data = strd[4].split('\n')  # remove newline
    data = data[0].split(',')
    for k in range(1, len(data)):
        result.append(data[k])
    return result


def runRoutes():
    with open("routes.txt") as fl:
        for line in fl:
            # route_id,route_short_name,route_long_name,route_type,route_url,route_color,route_text_color
            res = extractRoute(line)
            file_content.append({"route_id": res[0], "route_short_name": res[1], "route_long_name": res[2], "route_type": res[3], "route_url": res[4],
                                "route_color": res[5], "route_text_color": res[6]})

    dbname = get_database('transportation')
    collection_name = dbname["routes"]
    collection_name.insert_many(file_content)

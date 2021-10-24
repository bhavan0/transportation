from pymongo import MongoClient


def get_database(data_base_name):
    
    client = MongoClient('mongodb://mongodb:27017/')

    return client[data_base_name]

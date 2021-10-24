from insert_routes_mongodb import runRoutes
from insert_stops_mongodb import runStops

# Run methods to fill the seed data into the DB
def main():
    runRoutes()
    runStops()


if __name__ == "__main__":
    main()

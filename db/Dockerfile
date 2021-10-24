# syntax=docker/dockerfile:1

FROM python:3.9.7

# Create folder for holding the files
WORKDIR /app

# Copy all files from the local to the image file
ADD . /app

RUN pip3 install pymongo

CMD [ "python3", "transportation-db.py"]

# Steps to create image and deploy container in docker
# run -d -p 27017:27017 --name m1 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
# docker ps 
    # Get the container Id for the mongo container
# docker build -t [image-name] .
# docker run -p 5000:5000 [image-name]
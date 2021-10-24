# syntax=docker/dockerfile:1

FROM python:3.9.7

# Create folder for holding the files
WORKDIR /app

# Copy all files from the local to the image file
ADD . /app

# Install all dependencies: pyhton frameworks added in the requirements file
RUN pip3 install -r requirements.txt

# Expose port and run the python api server
EXPOSE 6003
CMD [ "python3", "transportation-publisher3.py"]

# Steps to create image and deploy container in docker
# docker build -t [image-name] .
# docker run -p 6002:6002 [image-name]
FROM node:14.17.6

# Create folder for holding the files
RUN mkdir app-ui

# Copy all files from the local to the image file
COPY ./dist/* /app-ui

# Move execution path into the created file
WORKDIR /app-ui

# Expose port and run the client server
EXPOSE 8080
RUN npm i -g http-server
CMD http-server ./


# Steps to create image and deploy container in docker
# docker build -t [name-of-image] .
# docker run -p 8080:8080 [name-of-image]
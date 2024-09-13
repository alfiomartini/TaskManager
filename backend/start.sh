#!/bin/bash

# Start MongoDB container


# -d: This flag runs the container in detached mode, which means that the container runs in the background.
# --name mongodb: This flag assigns the name mongodb to the container.
# -p 27017:27017: This flag maps port 27017 on the host machine to port 27017 on the container.
# -v mongodb_data:/data/db: This flag creates a volume named mongodb_data and mounts it to the /data/db directory inside the container.
# mongo:7.0: This specifies the image to use when creating the container. In this case, we are using the mongo:7.0 image.

docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:7.0

# Wait for MongoDB to be ready
# This part runs the mongo shell inside the mongodb container and evaluates the 
# JavaScript code print('MongoDB is up and running!'). If MongoDB is up and running, 
# this command will succeed. It also redirects the output to /dev/null to suppress the output.

echo "Waiting for MongoDB to start..."
until docker exec mongodb mongosh --eval "print('MongoDB is up and running!')" &>/dev/null; do
  sleep 1
done
echo "MongoDB is up and running!"

# Start the server



# node:20: This specifies the image to use when creating the container. In this case, we are using the node:20 image.
# bash -c "npm install && npm run dev": This command runs the npm install and npm run dev commands inside the container.
# npm install installs the dependencies specified in the package.json file, and npm run dev starts the server in development mode.
# The && operator is used to run the commands sequentially.
# -v $(pwd):/usr/src/app: This flag mounts the current directory on the host machine to the /usr/src/app directory inside the container.
# -w /usr/src/app: This flag sets the working directory inside the container to /usr/src/app.
# --link mongodb:mongodb: This flag links the mongodb container to the api container and assigns the alias mongodb to the linked container.
# In the --link flag, the first mongodb refers to the name of the container to link to, and the second mongodb refers to the alias assigned to the linked container.
# -p 3000:3000: This flag maps port 3000 on the host machine to port 3000 on the container.
docker run --name api -p 3000:3000 --link mongodb:mongodb -v $(pwd):/usr/src/app -w /usr/src/app node:20 bash -c "npm install && npm run dev"
echo "Server is up and running!"
#!/bin/bash

# start the mongoDB server
docker run -it \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  --name mongo_server \
  -v mongodb_data:/data/db \
  mongo:7.0 \

# access it from the local machine using mongosh client
# docker exec -it mongo_server mongosh "mongodb://root:example@localhost:27017/admin"
# or 
# mongosh "mongodb://root:example@localhost:27017/admin"

  
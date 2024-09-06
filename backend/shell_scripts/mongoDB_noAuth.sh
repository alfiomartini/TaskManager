#!/bin/bash

# start the mongoDB server
docker run -it \
  -p 27017:27017 \
  --name mongo_server \
  -v mongodb_data:/data/db \
  mongo:7.0 \

# access it from the local machine using mongosh client
# docker exec -it mongo_server mongosh 
#  or 
# mongosh  "mongodb://localhost:27017/task-manager"
  
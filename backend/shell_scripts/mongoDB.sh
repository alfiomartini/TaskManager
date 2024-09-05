#!/bin/bash

docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  --name mongodb \
  -v mongodb_data:/data/db \
  mongo:7.0
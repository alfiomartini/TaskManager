#!/bin/bash

docker run -it \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  --name mongodb_it \
  -v mongodb_data:/data/db \
  mongo:7.0 \
  bash

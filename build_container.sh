#!/bin/bash

echo "Building docker image..." && \
docker build --tag eth-certs:latest . && \
echo "Done"
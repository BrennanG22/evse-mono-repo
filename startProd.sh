#!/bin/bash

# Default value for RUN_INIT_SCRIPT (true = run init.sh, false = skip)
RUN_INIT=${1:-true}

# Stop and remove existing container if it exists
docker stop evse-app >/dev/null 2>&1 || true
docker rm evse-app >/dev/null 2>&1 || true

# Start new container with initialization control
docker run -d --restart unless-stopped --name evse-app -p 3000:3000 -p 2000:2000 -v evse-data:/app/config -e RUN_INIT_SCRIPT=$RUN_INIT evse-app

echo "EVSE container started with RUN_INIT_SCRIPT=$RUN_C
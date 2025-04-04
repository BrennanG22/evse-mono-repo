#!/bin/bash

VOLUME_NAME="evse-data"
IMAGE_FILE="evse-app.tar"

# Check if the Docker volume exists
if ! docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1; then
    echo "Volume '$VOLUME_NAME' does not exist. Creating it..."
    docker volume create "$VOLUME_NAME"
else
    echo "Volume '$VOLUME_NAME' already exists."
fi

# Check if the image file exists before loading
if [ -f "$IMAGE_FILE" ]; then
    echo "Loading Docker image from '$IMAGE_FILE'..."
    docker load -i "$IMAGE_FILE"
    echo "Docker image loaded successfully."
else
    echo "Error: '$IMAGE_FILE' not found!"
    exit 1
fi
#!/bin/sh

VOLUME_PATH="/app/config"
INIT_DATA_PATH="/app/initData"

echo "Initializing volume with default data..."
rm -rf "$VOLUME_PATH"/*
cp -r $INIT_DATA_PATH/* $VOLUME_PATH/



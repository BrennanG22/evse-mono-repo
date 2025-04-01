#!/bin/bash
set -e  # Exit on error

# Build Next.js app
npm run build --prefix ./next-app

# Compile TypeScript for modbus-app
npx tsc --project ./modbus-app/tsconfig.json

# Ensure the .env file exists before copying
cp -v ./modbus-app/src/.env ./modbus-app/out/

# Build Docker image
docker build -t evse-app -f docker/Dockerfile .

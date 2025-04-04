#!/bin/sh
set -e  # Exit immediately if any command fails

# Conditional script execution
if [ "$RUN_INIT_SCRIPT" = "true" ]; then
    echo "Running initialization script..."
    /usr/local/bin/init.sh
fi

# Execute the CMD from Dockerfile
exec "$@"
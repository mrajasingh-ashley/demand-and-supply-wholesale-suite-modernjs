#!/bin/sh
# This script runs when the container starts.

# Define the full path to the config file inside the Nginx container's web root.
CONFIG_FILE=/usr/share/nginx/html/config.json

echo "Starting configuration injection..."

# Check if the APP_SETTINGS_JSON environment variable exists and is not empty.
if [ -n "$APP_SETTINGS_JSON" ]; then
  # If it exists, overwrite the default config.json with the content of the environment variable.
  echo "Found APP_SETTINGS_JSON. Overwriting config.json with runtime values."
  echo -e "$APP_SETTINGS_JSON" > $CONFIG_FILE
else
  # If the variable is missing, log a warning and use the default file that was baked into the image.
  echo "WARNING: APP_SETTINGS_JSON environment variable not set. Using default configuration."
fi

echo "Configuration complete. Starting Nginx web server..."

nginx -t

# This command starts the main Nginx process. 'exec' is a best practice that makes
# Nginx the main process (PID 1), which helps the container shut down gracefully.
exec nginx -g 'daemon off;'

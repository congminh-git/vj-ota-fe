#!/bin/bash

# =============================================================================
# SkyJet OTA Frontend - Jenkins Build Script
# =============================================================================

set -e

# Set timestamp for build
now="$(date +'%Y%m%d-%H%M%S')"

PROJECT_NAME="ota-fe"

echo "=========================================="
echo "Building $PROJECT_NAME"
echo "Build timestamp: $now"
echo "=========================================="

# Display environment file if exists
if [ -f "$WORKSPACE/.env" ]; then
    echo "Created .env file:"
    cat $WORKSPACE/.env
    echo ""
fi

# Navigate to workspace and build the Docker image
echo "Building Docker image..."
cd $WORKSPACE && docker build \
  --build-arg NEXT_PUBLIC_PUBLICAPI_URL=${NEXT_PUBLIC_PUBLICAPI_URL:-https://api.skyjet-ota.site} \
  -t $PROJECT_NAME .

echo "Remove current container"
docker stop $PROJECT_NAME || true
docker rm $PROJECT_NAME || true

echo "Create new updated container"
# Note: FE uses Next.js server on port 3000, mapping to host port 6300
docker run -dp 6300:3000 \
  --restart unless-stopped \
  --name $PROJECT_NAME \
  $PROJECT_NAME

# Setup log file
echo '' > $WORKSPACE/$PROJECT_NAME.txt
nohup docker logs $PROJECT_NAME -f >> $WORKSPACE/$PROJECT_NAME.txt &

sleep 2

echo "Container logs:"
docker logs $PROJECT_NAME

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "Container: $PROJECT_NAME"
echo "Port: 6300:3000"
echo "=========================================="


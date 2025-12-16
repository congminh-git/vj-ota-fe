#!/bin/bash

# =============================================================================
# SkyJet OTA Frontend - Jenkins Build Script (INLINE VERSION)
# Copy toàn bộ script này vào Jenkins "Execute shell" text box
# =============================================================================

set -e

now="$(date +'%Y%m%d-%H%M%S')"
PROJECT_NAME="ota-fe"

echo "=========================================="
echo "Building $PROJECT_NAME"
echo "Build timestamp: $now"
echo "=========================================="

if [ -f "$WORKSPACE/.env" ]; then
    echo "Created .env file:"
    cat $WORKSPACE/.env
    echo ""
fi

echo "Building Docker image..."
cd $WORKSPACE && docker build \
  --build-arg NEXT_PUBLIC_PUBLICAPI_URL=${NEXT_PUBLIC_PUBLICAPI_URL:-https://api.skyjet-ota.site} \
  -t $PROJECT_NAME .

echo "Remove current container"
docker stop $PROJECT_NAME || true
docker rm $PROJECT_NAME || true

echo "Create new updated container"
docker run -dp 6300:3000 \
  --restart unless-stopped \
  --name $PROJECT_NAME \
  $PROJECT_NAME

echo '' > $WORKSPACE/$PROJECT_NAME.txt
nohup docker logs $PROJECT_NAME -f >> $WORKSPACE/$PROJECT_NAME.txt &

sleep 2

docker logs $PROJECT_NAME

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "Container: $PROJECT_NAME"
echo "Port: 6300:3000"
echo "=========================================="


#!/bin/bash
# Build static export for Capacitor (iOS/Android)
# API routes are excluded since mobile app calls the Render backend directly

set -e

echo "==> Preparing mobile build..."

# Temporarily move API routes out (they don't work in static export)
if [ -d "src/app/api" ]; then
  mv src/app/api src/app/_api_backup
  echo "    Moved API routes aside"
fi

# Build static export
echo "==> Building static export..."
BUILD_MODE=static npx next build

echo "==> Static build complete -> /out"

# Restore API routes
if [ -d "src/app/_api_backup" ]; then
  mv src/app/_api_backup src/app/api
  echo "    Restored API routes"
fi

# Sync with Capacitor
echo "==> Syncing with Capacitor..."
npx cap sync ios

echo "==> Done! Open Xcode: npx cap open ios"

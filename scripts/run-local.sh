#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$FRONTEND_DIR"

if [[ ! -d node_modules ]]; then
  echo "Frontend dependencies are missing. Run npm install in $FRONTEND_DIR first." >&2
  exit 1
fi

echo "Starting MeritIQRa One UI at http://127.0.0.1:3001"
BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:8081}"
exec env NEXT_DIST_DIR=.next-dev BACKEND_URL="$BACKEND_URL" NEXT_PUBLIC_API_BASE_URL="" npm run dev -- --hostname 127.0.0.1 --port 3001

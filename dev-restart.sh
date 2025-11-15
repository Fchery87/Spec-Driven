#!/bin/bash
# Development server restart script
# Ensures clean start on port 3000

echo "🔄 Restarting development server..."

# Kill any existing Next.js processes
echo "  → Stopping existing servers..."
pkill -9 -f "next dev" 2>/dev/null || true

# Kill anything using port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 1

# Clear Next.js cache
echo "  → Clearing .next cache..."
rm -rf .next

# Clear any stale artifacts (optional - comment out if you want to keep them)
# rm -rf projects/*/specs/*/v1/*

echo "  → Starting server on port 3000..."
npm run dev

echo "✅ Server started!"

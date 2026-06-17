#!/usr/bin/env bash
# Deploy script for Ubuntu Server
# Usage: bash deploy.sh

set -e

echo "🚀 Deploying portfolio..."

# Pull latest changes (if cloned via git)
if [ -d .git ]; then
  echo "📥 Pulling latest changes..."
  git pull
fi

# Make sure .env exists
if [ ! -f .env ]; then
  echo "⚠️  .env not found. Copying from .env.example — please edit it!"
  cp .env.example .env
  exit 1
fi

# Build & start
echo "🔨 Building containers..."
docker compose build --no-cache

echo "▶️  Starting containers..."
docker compose up -d

echo "📋 Container status:"
docker compose ps

echo "✅ Done. Portfolio should be live at http://$(curl -s ifconfig.me || echo localhost)"

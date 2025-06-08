#!/bin/bash

echo "🧹 Cleaning Docker..."
docker-compose down --volumes --remove-orphans
docker system prune -f

echo "🔨 Building Docker containers..."
docker-compose build --no-cache

echo "🚀 Starting project..."
docker-compose up -d

echo "✅ Project started. Backend: http://localhost:5000 | Frontend: http://localhost:3000 | pgAdmin: http://localhost:5050"

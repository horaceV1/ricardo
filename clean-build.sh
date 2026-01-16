#!/bin/bash

# Clean install script for Hostinger deployment
echo "🧹 Cleaning old builds..."
rm -rf node_modules
rm -rf .next
rm -f package-lock.json

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "✅ Build complete! Ready to deploy."

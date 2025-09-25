#!/bin/bash

# Simple deployment script to bypass artifact uploads
# This script prepares your project for deployment to Render

echo "🚀 Starting deployment preparation..."

# Navigate to server directory
cd server

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create build directory if it doesn't exist
mkdir -p build

# Copy necessary files to build directory
echo "📋 Preparing build files..."
cp price-scraper.js build/
cp test-scraper.js build/
cp package.json build/
cp -r node_modules build/ 2>/dev/null || echo "Note: node_modules will be installed on Render"

# Create a simple build info file
echo "Build completed at $(date)" > build/build-info.txt
echo "Node version: $(node --version)" >> build/build-info.txt
echo "Platform: Render.com" >> build/build-info.txt

echo "✅ Build preparation completed!"
echo "📁 Build files are ready in server/build/"
echo "🔄 Your project is ready for deployment to Render"

# Go back to root directory
cd ..

echo ""
echo "📋 Next steps:"
echo "1. Commit and push your changes to GitHub"
echo "2. Render will automatically detect the changes"
echo "3. The build will run: npm install"
echo "4. The server will start: node price-scraper.js"
echo ""
echo "🎉 Deployment bypass successful!"

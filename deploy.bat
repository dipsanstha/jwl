@echo off
REM Simple deployment script to bypass artifact uploads
REM This script prepares your project for deployment to Render

echo 🚀 Starting deployment preparation...

REM Navigate to server directory
cd server

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create build directory if it doesn't exist
if not exist build mkdir build

REM Copy necessary files to build directory
echo 📋 Preparing build files...
copy price-scraper.js build\ >nul 2>&1
copy test-scraper.js build\ >nul 2>&1
copy package.json build\ >nul 2>&1
xcopy /E /I /H /Y node_modules build\node_modules >nul 2>&1 || echo Note: node_modules will be installed on Render

REM Create a simple build info file
echo Build completed at %date% %time% > build\build-info.txt
echo Node version: %node --version% >> build\build-info.txt 2>&1
echo Platform: Render.com >> build\build-info.txt

echo ✅ Build preparation completed!
echo 📁 Build files are ready in server\build\
echo 🔄 Your project is ready for deployment to Render

REM Go back to root directory
cd ..

echo.
echo 📋 Next steps:
echo 1. Commit and push your changes to GitHub
echo 2. Render will automatically detect the changes
echo 3. The build will run: npm install
echo 4. The server will start: node price-scraper.js
echo.
echo 🎉 Deployment bypass successful!
pause

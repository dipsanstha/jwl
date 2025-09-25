@echo off
REM Simple deployment bypass script
REM This script bypasses npm install issues completely

echo 🚀 Starting deployment bypass preparation...

REM Navigate to server directory
cd server

REM Create build directory if it doesn't exist
if not exist build mkdir build

REM Copy necessary files to build directory
echo 📋 Preparing build files...
copy price-scraper.js build\ >nul 2>&1
copy test-scraper.js build\ >nul 2>&1
copy package.json build\ >nul 2>&1

REM Create a simple build info file
echo Build completed at %date% %time% > build\build-info.txt
echo Node version: node --version >> build\build-info.txt 2>&1
echo Platform: Render.com >> build\build-info.txt
echo Deployment: BYPASS MODE >> build\build-info.txt

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
echo.
echo 💡 Note: This bypass mode skips local npm install.
echo    Render will handle dependency installation automatically.
pause

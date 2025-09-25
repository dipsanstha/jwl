# 🚀 Deployment Bypass Guide

This guide helps you deploy your JWL project to Render without complex artifact uploads.

## Quick Deployment

### Option 1: Use the deployment script (Recommended)
```bash
# On Windows
.\deploy.bat

# On Linux/Mac
./deploy.sh
```

### Option 2: Manual deployment
```bash
cd server
npm install
```

## What the script does:
1. ✅ Installs all dependencies in the server directory
2. ✅ Creates a build directory with necessary files
3. ✅ Prepares your project for Render deployment
4. ✅ Bypasses the need for GitHub Actions artifact uploads

## Render Configuration
Your `render.yaml` is already configured correctly:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node price-scraper.js`

## Deployment Steps:
1. Run the deployment script
2. Commit and push your changes to GitHub
3. Render will automatically detect changes and deploy
4. Your API will be available at your Render URL

## Troubleshooting:
- If npm install fails, try deleting `node_modules` and `package-lock.json` first
- Make sure your `ADMIN_TOKEN` environment variable is set in Render
- Check the Render logs if deployment fails

## Benefits of this approach:
- ✅ No complex CI/CD pipeline needed
- ✅ Direct deployment from GitHub
- ✅ Automatic dependency installation on Render
- ✅ Simple and reliable deployment process

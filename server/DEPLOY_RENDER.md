# Deploy the API to Render (Free)

This guide deploys the Node API in `server/` so your GitHub Pages site can upload and list images.

## Prerequisites
- A GitHub repository containing this project.
- A free account at https://render.com

## Steps
1. Log in to Render and click "New" → "Web Service"
2. Connect your GitHub repo and select it.
3. On the service setup page:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node price-scraper.js`
   - Environment → Add Variable:
     - Key: `ADMIN_TOKEN`
     - Value: `choose-a-secret` (any strong string you will also enter in the Admin page)
4. Click "Create Web Service" and wait for the deploy to complete.
5. Copy your service URL, e.g. `https://your-app.onrender.com`

## Wire the frontend to the API
1. In the repo root, open `data/config.json`
2. Set:
```json
{
  "apiBase": "https://your-app.onrender.com"
}
```
3. Commit and push to GitHub. Your GitHub Pages site will use the API automatically.

## Use the Admin Page
1. Open `https://<your-gh-username>.github.io/jewellery/admin-gallery.html`
2. In the "Admin Token" panel:
   - Enter the same token you set as `ADMIN_TOKEN` on Render
   - Click "Save Token"
3. Upload an image. It should appear in the list.
4. Open your homepage and verify the new image appears in the gallery.

## Notes
- Uploaded files are stored at `/static-images/uploads/` on your Render service.
- CORS is enabled by default. You can tighten it later if desired.
- If the API is offline or unreachable, the site falls back to `data/gallery.json`.
- To change the token later, update the Render environment variable and re-enter it on the Admin page.

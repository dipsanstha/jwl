// FENEGOSIDA Price Scraper - Node.js server to scrape gold and silver prices from FENEGOSIDA.org
// Polyfill: Ensure global File exists on Node 18 (Render free plan uses Node 18) to prevent undici v6 crashes
if (typeof globalThis.File === 'undefined') {
  try {
    class File extends Blob {
      constructor(bits, name, options = {}) {
        super(bits, options);
        this.name = String(name || 'file');
        this.lastModified = options.lastModified || Date.now();
      }
      get [Symbol.toStringTag]() { return 'File'; }
    }
    globalThis.File = File;
  } catch (e) {
    // If Blob is missing for some reason, fall back silently
  }
}
// Federation of Nepal Gold and Silver Dealers' Association
// This solves CORS issues by running the fetch on the server side

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your website with credentials (for cookies)
app.use(cors({
  origin: function(origin, cb){
    // Allow same-origin requests (origin may be undefined), and reflect provided origin for cross-site admin UI
    cb(null, origin || true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Security headers via helmet
app.disable('x-powered-by');
app.use(helmet({
    frameguard: false, // we'll use CSP frame-ancestors instead
    // Allow other origins (e.g., GitHub Pages) to embed images served by this API
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Disable COEP to avoid cross-origin embed restrictions for static assets
    crossOriginEmbedderPolicy: false,
    // Be permissive to allow popups/embeds if needed
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));

// =============================
// Admin Accounts & Auth Utils
// =============================
const CONFIG_PATH = path.join(__dirname, '..', 'data', 'config.json');
function readConfig(){
  try{
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw || '{}');
  }catch(e){
    return {};
  }
}
function getAccounts(){
  const cfg = readConfig();
  const admin = cfg.admin || {};
  // Back-compat single passHash + users
  const accounts = Array.isArray(admin.accounts) ? admin.accounts : [];
  if (!accounts.length && admin.passHash){
    const users = Array.isArray(admin.users) ? admin.users : ['admin'];
    return users.map(u => ({ user: u, passHash: String(admin.passHash) }));
  }
  return accounts.map(a => ({ user: String(a.user||'').trim(), passHash: String(a.passHash||''), bcryptHash: a.bcryptHash ? String(a.bcryptHash) : null }));
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const COOKIE_NAME = 'auth_token';
function buildCookieOptions(){
  const onRender = !!process.env.RENDER;
  // Use cross-site friendly cookies on Render deployments
  if (onRender){
    return {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      path: '/'
    };
  }
  // Local dev fallback
  return {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    path: '/'
  };
}

function sha256Hex(str){
  return crypto.createHash('sha256').update(String(str)).digest('hex');
}

function signToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token){
  try{ return jwt.verify(token, JWT_SECRET); } catch(e){ return null; }
}

function requireAuth(req, res, next){
  const token = req.cookies && req.cookies[COOKIE_NAME];
  const data = token && verifyToken(token);
  if (!data || !data.sub){
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  req.user = { username: data.sub };
  next();
}

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try{
    const { username = '', password = '' } = req.body || {};
    const accounts = getAccounts();
    const acct = accounts.find(a => (a.user||'').toLowerCase() === String(username||'').toLowerCase())
              || accounts[0]; // allow first account if username omitted
    if (!acct){
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    let ok = false;
    if (acct.bcryptHash){
      // lazy require to avoid mandatory dep if not used
      const bcrypt = require('bcryptjs');
      ok = await bcrypt.compare(String(password), acct.bcryptHash);
    } else if (acct.passHash){
      const stored = String(acct.passHash).toLowerCase();
      const hashed = sha256Hex(String(password));
      // Accept either SHA-256 hex or plaintext equality to support current config
      ok = (hashed === stored) || (String(password) === String(acct.passHash));
    }
    if (!ok){
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = signToken({ sub: acct.user });
    res.cookie(COOKIE_NAME, token, buildCookieOptions());
    res.json({ success: true, user: { username: acct.user } });
  }catch(e){
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...buildCookieOptions(), maxAge: 0 });
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  const data = token && verifyToken(token);
  if (!data || !data.sub){
    return res.status(401).json({ success: false, authenticated: false });
  }
  res.json({ success: true, authenticated: true, user: { username: data.sub } });
});
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'],
        'style-src': ["'self'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        // Allow images to be consumed cross-origin (e.g., GitHub Pages consuming onrender images)
        'img-src': ['*', 'data:', 'blob:'],
        // Allow fetch/XHR from any origin so GH Pages can request this API
        'connect-src': ['*'],
        'frame-src': ['https://www.google.com'],
        'frame-ancestors': ['*']
    }
}));

// Static file serving for images (so frontend can reference /static-images/...)
const IMAGES_ROOT = path.join(__dirname, '..', 'images');
app.use('/static-images', express.static(IMAGES_ROOT));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(IMAGES_ROOT, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Reusable normalization routine
function normalizeGallery() {
    const gallery = readGallery();
    const results = [];
    try {
        gallery.images = (gallery.images || []).map(entry => {
            try {
                let url = entry.url || '';
                // Already in uploads and filename is safe
                if (url.startsWith('/static-images/uploads/')) {
                    results.push({ id: entry.id, action: 'kept', url });
                    return entry;
                }

                // Resolve physical file path for current URL
                const relative = url.replace('/static-images/', '');
                const srcPath = path.join(IMAGES_ROOT, relative);
                if (!fs.existsSync(srcPath)) {
                    results.push({ id: entry.id, action: 'missing_source', url });
                    return entry; // skip if source missing
                }

                // Build safe filename
                const ext = path.extname(srcPath) || '.png';
                const baseName = path.basename(srcPath, ext)
                    .replace(/[^a-z0-9_-]/gi, '_')
                    .replace(/_+/g, '_');
                const safeName = `${baseName}_${Date.now()}_${Math.floor(Math.random()*1e6)}${ext}`;
                const destPath = path.join(UPLOADS_DIR, safeName);
                fs.copyFileSync(srcPath, destPath);

                const newUrl = `/static-images/uploads/${safeName}`;
                results.push({ id: entry.id, action: 'migrated', from: url, to: newUrl });
                return { ...entry, url: newUrl };
            } catch (e) {
                results.push({ id: entry.id, action: 'error', error: e.message });
                return entry;
            }
        });
        writeGallery(gallery);
        return { success: true, results, total: gallery.images.length };
    } catch (e) {
        console.error('Normalize failed:', e);
        return { success: false, error: 'Normalize failed' };
    }
}

// Normalize gallery entries: ensure files live under uploads/ with safe names
app.post('/api/gallery/normalize', requireAuth, (req, res) => {
    const outcome = normalizeGallery();
    if (!outcome.success) return res.status(500).json(outcome);
    res.json(outcome);
});

// Gallery manifest path
const GALLERY_MANIFEST = path.join(__dirname, '..', 'data', 'gallery.json');

function readGallery() {
    try {
        if (!fs.existsSync(GALLERY_MANIFEST)) {
            return { images: [] };
        }
        const raw = fs.readFileSync(GALLERY_MANIFEST, 'utf-8');
        return JSON.parse(raw || '{"images": []}');
    } catch (e) {
        console.error('Failed to read gallery manifest:', e.message);
        return { images: [] };
    }
}

function writeGallery(data) {
    try {
        fs.writeFileSync(GALLERY_MANIFEST, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Failed to write gallery manifest:', e.message);
    }
}

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
        const unique = Date.now() + '_' + Math.floor(Math.random() * 1e6);
        cb(null, `${base}_${unique}${ext}`);
    }
});

const upload = multer({ storage });

// Cache to avoid too frequent requests to FENEGOSIDA.org
let priceCache = {
    data: null,
    lastUpdated: null,
    cacheDuration: 5 * 60 * 1000 // 5 minutes
};

// Helper function to parse numbers from text
function parsePrice(text) {
    if (!text) return null;
    const match = text.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null;
}

// Scrape prices from FENEGOSIDA website
async function scrapeFenegosidaPrices() {
    try {
        console.log('Scraping prices from FENEGOSIDA...');
        const response = await axios.get('https://fenegosida.org/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);
        
        // Extract prices from the website content
        let fineGoldPer10Grm = null;
        let fineGoldPerTola = null;
        let tejabiGoldPer10Grm = null;
        let tejabiGoldPerTola = null;
        let silverPer10Grm = null;
        let silverPerTola = null;
        
        // Get all text content
        const pageText = $('body').text();
        
        // Extract Fine Gold (9999) per 10 grm - looking for "Nrs 185185/-" pattern
        const fineGold10GrmMatch = pageText.match(/FINE GOLD \(9999\)\s*per 10 grm\s*Nrs\s*([\d,]+)/i);
        if (fineGold10GrmMatch) {
            fineGoldPer10Grm = parseFloat(fineGold10GrmMatch[1].replace(/,/g, ''));
        }
        
        // Extract Fine Gold (9999) per 1 tola - looking for "रु 216000" pattern
        const fineGoldTolaMatch = pageText.match(/FINE GOLD \(9999\)\s*per 1 tola\s*रु\s*([\d,]+)/i);
        if (fineGoldTolaMatch) {
            fineGoldPerTola = parseFloat(fineGoldTolaMatch[1].replace(/,/g, ''));
        }
        
        // Extract TEJABI GOLD per 10 grm
        const tejabiGold10GrmMatch = pageText.match(/TEJABI GOLD\s*per 10 grm\s*Nrs\s*([\d,]+)/i);
        if (tejabiGold10GrmMatch) {
            tejabiGoldPer10Grm = parseFloat(tejabiGold10GrmMatch[1].replace(/,/g, ''));
        }
        
        // Extract TEJABI GOLD per 1 tola
        const tejabiGoldTolaMatch = pageText.match(/TEJABI GOLD\s*per 1 tola\s*रु\s*([\d,]+)/i);
        if (tejabiGoldTolaMatch) {
            tejabiGoldPerTola = parseFloat(tejabiGoldTolaMatch[1].replace(/,/g, ''));
        }
        
        // Extract SILVER per 10 grm
        const silver10GrmMatch = pageText.match(/SILVER\s*per 10 grm\s*Nrs\s*([\d,]+)/i);
        if (silver10GrmMatch) {
            silverPer10Grm = parseFloat(silver10GrmMatch[1].replace(/,/g, ''));
        }
        
        // Extract SILVER per 1 tola
        const silverTolaMatch = pageText.match(/SILVER\s*per 1 tola\s*रु\s*([\d,]+)/i);
        if (silverTolaMatch) {
            silverPerTola = parseFloat(silverTolaMatch[1].replace(/,/g, ''));
        }
        
        // Fallback: try to find any numbers that look like prices
        if (!fineGoldPer10Grm || !fineGoldPerTola || !silverPer10Grm || !silverPerTola) {
            console.log('Using fallback price extraction...');
            
            // Look for any 6-digit numbers that could be prices
            const allNumbers = pageText.match(/\b\d{5,6}\b/g);
            if (allNumbers) {
                const prices = allNumbers.map(n => parseInt(n)).filter(n => n > 10000 && n < 1000000);
                
                if (prices.length >= 4) {
                    // Assume the first few large numbers are our prices
                    fineGoldPer10Grm = fineGoldPer10Grm || prices[0];
                    fineGoldPerTola = fineGoldPerTola || prices[1];
                    silverPer10Grm = silverPer10Grm || prices[2];
                    silverPerTola = silverPerTola || prices[3];
                }
            }
        }
        
        // Use fallback values if still no prices found
        if (!fineGoldPer10Grm) fineGoldPer10Grm = 185185;
        if (!fineGoldPerTola) fineGoldPerTola = 216000;
        if (!tejabiGoldPer10Grm) tejabiGoldPer10Grm = 0;
        if (!tejabiGoldPerTola) tejabiGoldPerTola = 0;
        if (!silverPer10Grm) silverPer10Grm = 2212;
        if (!silverPerTola) silverPerTola = 2580;
        
        // Calculate prices per gram (10 grams = 1 tola approximately)
        const fineGoldPerGram = fineGoldPer10Grm / 10;
        const tejabiGoldPerGram = tejabiGoldPer10Grm / 10;
        const silverPerGram = silverPer10Grm / 10;
        
        // Calculate different karats based on fine gold
        const karats = {
            '24k': Math.round(fineGoldPerTola),
            '22k': Math.round(fineGoldPerTola * 0.917),
            '21k': Math.round(fineGoldPerTola * 0.875),
            '18k': Math.round(fineGoldPerTola * 0.75)
        };
        
        return {
            gold: {
                fine: {
                    pricePer10Grm: fineGoldPer10Grm,
                    pricePerTola: fineGoldPerTola,
                    pricePerGram: fineGoldPerGram
                },
                tejabi: {
                    pricePer10Grm: tejabiGoldPer10Grm,
                    pricePerTola: tejabiGoldPerTola,
                    pricePerGram: tejabiGoldPerGram
                },
                karats: karats
            },
            silver: {
                pricePer10Grm: silverPer10Grm,
                pricePerTola: silverPerTola,
                pricePerGram: silverPerGram
            },
            source: 'FENEGOSIDA.org',
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Error scraping FENEGOSIDA prices:', error.message);
        throw error;
    }
}

// API endpoint to get Nepal gold and silver prices from FENEGOSIDA
app.get('/api/nepal-gold-prices', async (req, res) => {
    try {
        // Check cache first
        const now = Date.now();
        if (priceCache.data && priceCache.lastUpdated && 
            (now - priceCache.lastUpdated) < priceCache.cacheDuration) {
            console.log('Returning cached FENEGOSIDA price data');
            return res.json({
                success: true,
                cached: true,
                ...priceCache.data
            });
        }
        
        // Fetch fresh data from FENEGOSIDA
        console.log('Fetching fresh data from FENEGOSIDA...');
        const fenegosidaData = await scrapeFenegosidaPrices();
        
        const result = {
            success: true,
            cached: false,
            timestamp: new Date().toISOString(),
            source: 'FENEGOSIDA.org',
            gold: {
                karats: fenegosidaData.gold.karats,
                fine: fenegosidaData.gold.fine,
                tejabi: fenegosidaData.gold.tejabi
            },
            silver: fenegosidaData.silver
        };
        
        // Update cache
        priceCache.data = result;
        priceCache.lastUpdated = now;
        
        res.json(result);
        
    } catch (error) {
        console.error('FENEGOSIDA API error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: {
                gold: {
                    karats: {
                        '24k': 216000,
                        '22k': 198072,
                        '21k': 189000,
                        '18k': 162000
                    },
                    fine: {
                        pricePerTola: 216000,
                        pricePer10Grm: 185185,
                        pricePerGram: 18518.5
                    },
                    tejabi: {
                        pricePerTola: 0,
                        pricePer10Grm: 0,
                        pricePerGram: 0
                    }
                },
                silver: {
                    pricePerTola: 2580,
                    pricePer10Grm: 2212,
                    pricePerGram: 221.2
                },
                source: 'FENEGOSIDA.org (Fallback)',
                timestamp: new Date().toISOString()
            }
        });
    }
});

// =============================
// Gallery Management Endpoints
// =============================

// List gallery images
app.get('/api/gallery', (req, res) => {
    const gallery = readGallery();
    res.json({ success: true, ...gallery });
});

// Upload new image
app.post('/api/gallery', requireAuth, upload.single('image'), (req, res) => {
    try {
        // Admin token removed per request – this endpoint is now open.
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }
        const { title = '', description = '', category = 'all' } = req.body || {};
        const gallery = readGallery();
        const id = 'img_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
        const url = `/static-images/uploads/${req.file.filename}`;
        const entry = {
            id,
            title,
            description,
            category: String(category || 'all').toLowerCase(),
            url,
            createdAt: new Date().toISOString()
        };
        gallery.images.unshift(entry);
        writeGallery(gallery);
        // Optionally auto-normalize right after upload
        if ((process.env.AUTO_NORMALIZE_ON_UPLOAD || 'false').toLowerCase() === 'true') {
            setImmediate(() => {
                const out = normalizeGallery();
                const migrated = (out.results || []).filter(r => r.action === 'migrated').length;
                if (migrated) console.log(`[normalize] Post-upload migrated: ${migrated}`);
            });
        }
        res.json({ success: true, image: entry });
    } catch (e) {
        console.error('Upload failed:', e);
        res.status(500).json({ success: false, error: 'Upload failed' });
    }
});

// Delete an image by ID
app.delete('/api/gallery/:id', requireAuth, (req, res) => {
    try {
        // Admin token removed per request – this endpoint is now open.
        const { id } = req.params;
        const gallery = readGallery();
        const idx = gallery.images.findIndex(i => i.id === id);
        if (idx === -1) {
            return res.status(404).json({ success: false, error: 'Image not found' });
        }
        const toDelete = gallery.images[idx];
        // Attempt to remove the physical file
        if (toDelete.url && toDelete.url.startsWith('/static-images/')) {
            const relative = toDelete.url.replace('/static-images/', '');
            const filePath = path.join(IMAGES_ROOT, relative);
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { console.warn('File delete warning:', e.message); }
            }
        }
        gallery.images.splice(idx, 1);
        writeGallery(gallery);
        res.json({ success: true });
    } catch (e) {
        console.error('Delete failed:', e);
        res.status(500).json({ success: false, error: 'Delete failed' });
    }
});

// Delete ALL images and clear manifest
app.delete('/api/gallery', requireAuth, (req, res) => {
    try {
        const gallery = readGallery();
        const removed = [];
        (gallery.images || []).forEach(item => {
            try {
                if (item.url && item.url.startsWith('/static-images/')) {
                    const relative = item.url.replace('/static-images/', '');
                    const filePath = path.join(IMAGES_ROOT, relative);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        removed.push(relative);
                    }
                }
            } catch(e) {
                console.warn('Delete-all file warning:', e.message);
            }
        });
        writeGallery({ images: [] });
        res.json({ success: true, removedCount: removed.length });
    } catch (e) {
        console.error('Delete all failed:', e);
        res.status(500).json({ success: false, error: 'Delete all failed' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        cache: {
            hasData: !!priceCache.data,
            lastUpdated: priceCache.lastUpdated,
            age: priceCache.lastUpdated ? Date.now() - priceCache.lastUpdated : null
        }
    });
});

// =============================
// Static Site Hosting & Assets
// =============================
// Serve Font Awesome locally from node_modules (if installed)
try {
    const faPkg = require.resolve('@fortawesome/fontawesome-free/package.json');
    const FA_ROOT = path.dirname(faPkg);
    app.use('/vendor/fontawesome/css', express.static(path.join(FA_ROOT, 'css')));
    app.use('/vendor/fontawesome/webfonts', express.static(path.join(FA_ROOT, 'webfonts')));
    console.log('Font Awesome served locally at /vendor/fontawesome');
} catch (e) {
    console.warn('Font Awesome package not found. Run npm install in server/ to self-host.');
}

// Serve the entire site (project root) statically with cache headers
const SITE_ROOT = path.join(__dirname, '..');
app.use('/', express.static(SITE_ROOT, {
    extensions: ['html'],
    setHeaders: (res, filePath) => {
        if (/\.(css|js|png|jpg|jpeg|gif|svg|woff2|woff)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        } else {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

app.listen(PORT, () => {
    console.log(`FENEGOSIDA Price Scraper API running on port ${PORT}`);
});
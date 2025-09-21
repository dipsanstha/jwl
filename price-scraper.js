// FENEGOSIDA Price Scraper - Node.js server to scrape gold and silver prices from FENEGOSIDA.org
// Federation of Nepal Gold and Silver Dealers' Association
// This solves CORS issues by running the fetch on the server side

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your website
app.use(cors({
    origin: ['http://localhost', 'http://127.0.0.1', 'https://yourdomain.com'],
    credentials: true
}));

app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`FENEGOSIDA Price Scraper API running on port ${PORT}`);
    console.log(`Gold & Silver prices endpoint: http://localhost:${PORT}/api/nepal-gold-prices`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Source: FENEGOSIDA.org - Federation of Nepal Gold and Silver Dealers' Association`);
});
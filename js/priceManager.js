// ============================
// priceManager.js (Updated)
// ============================

class NepalPriceManager {
    constructor() {
        this.dataFile = 'data/prices.json';
        this.apiEndpoints = {
            fnego: 'https://fenegosida.org/fenegosida/gold-price' // Official site
        };
        this.subscribers = [];
        this.priceHistory = [];
        this.currentPrices = {};
        this.lastUpdate = null;
        this.init();
    }

    async init() {
        await this.loadPriceData();
        this.setupAutoUpdate();
        this.initializeUI();
    }

    // ----------------------------
    // Fetch Prices from FENEGOSIDA
    // ----------------------------
    async fetchFromFENEGOSIDA() {
        try {
            console.log('Fetching prices from FENEGOSIDA...');
            const response = await fetch(this.apiEndpoints.fnego);
            const html = await response.text();

            const goldMatch = html.match(/Hallmark Gold[^<]*<td[^>]*>([\d,]+)/i);
            const tajabiMatch = html.match(/Tajabi Gold[^<]*<td[^>]*>([\d,]+)/i);
            const silverMatch = html.match(/Silver[^<]*<td[^>]*>([\d,]+)/i);

            const prices = {
                gold: {
                    "24k": goldMatch ? parseInt(goldMatch[1].replace(/,/g, '')) : 0,
                    "22k": tajabiMatch ? parseInt(tajabiMatch[1].replace(/,/g, '')) : 0
                },
                silver: {
                    pure: silverMatch ? parseInt(silverMatch[1].replace(/,/g, '')) : 0
                },
                timestamp: new Date().toISOString(),
                source: "FENEGOSIDA"
            };

            console.log("FENEGOSIDA prices:", prices);
            return prices;
        } catch (error) {
            console.error("Error fetching from FENEGOSIDA:", error);
            return null;
        }
    }

    // ----------------------------
    // Use FENEGOSIDA first
    // ----------------------------
    async fetchPricesWithFallbacks() {
        const strategies = [
            () => this.fetchFromFENEGOSIDA(),
            () => this.generateSmartFallbackPrices()
        ];

        for (let strategy of strategies) {
            try {
                const result = await strategy();
                if (result) return result;
            } catch (error) {
                console.log('Strategy failed:', error.message);
            }
        }

        return this.generateSmartFallbackPrices();
    }

    // ----------------------------
    // Simplified Live Price Fetch
    // ----------------------------
    async fetchLivePrices() {
        const data = await this.fetchPricesWithFallbacks();
        if (data) {
            const updatedPrices = {
                gold: this.processGoldData(data.gold),
                silver: this.processSilverData(data.silver)
            };
            await this.updatePrices(updatedPrices);
            return updatedPrices;
        }
        return this.currentPrices;
    }

    // processGoldData, processSilverData, updatePrices, etc. remain same as before
}

// ============================
// Add missing methods and robust strategy
// ============================

// Prefer local API (our Express server) to avoid CORS
NepalPriceManager.prototype.fetchFromLocalAPI = async function() {
    try {
        const res = await fetch('http://localhost:3001/api/nepal-gold-prices', { cache: 'no-cache' });
        if (!res.ok) throw new Error('Local API unavailable');
        const data = await res.json();
        return {
            gold: {
                karats: data.gold?.karats,
                fine: data.gold?.fine,
                tejabi: data.gold?.tejabi
            },
            silver: data.silver,
            timestamp: data.timestamp,
            source: 'local-api'
        };
    } catch (e) {
        return null;
    }
};

// Override strategy to try local API first, then FENEGOSIDA, then fallback
NepalPriceManager.prototype.fetchPricesWithFallbacks = async function() {
    const strategies = [
        () => this.fetchFromLocalAPI(),
        () => this.fetchFromFENEGOSIDA(),
        () => this.generateSmartFallbackPrices()
    ];
    for (const s of strategies) {
        try {
            const r = await s();
            if (r) return r;
        } catch (err) {
            console.log('Strategy failed:', err?.message || err);
        }
    }
    return this.generateSmartFallbackPrices();
};

// Minimal no-op loaders to satisfy calls
NepalPriceManager.prototype.loadPriceData = async function() {
    // Could load from local storage in future
    if (!this.currentPrices || !Object.keys(this.currentPrices).length) {
        this.currentPrices = {
            gold: {
                '24k': { price: 216000 },
                '22k': { price: 198072 },
                '21k': { price: 189000 },
                '18k': { price: 162000 }
            },
            silver: { pure: { price: 2580 } }
        };
    }
};

NepalPriceManager.prototype.setupAutoUpdate = function() {
    // No-op for now
};

NepalPriceManager.prototype.initializeUI = function() {
    // No-op for now
};

// Create reasonable fallback data
NepalPriceManager.prototype.generateSmartFallbackPrices = function() {
    const base24 = 216000;
    const gold = {
        karats: {
            '24k': base24,
            '22k': Math.round(base24 * 0.917),
            '21k': Math.round(base24 * 0.875),
            '18k': Math.round(base24 * 0.75)
        },
        fine: {
            pricePerTola: base24,
            pricePer10Grm: 185185,
            pricePerGram: 18518.5
        },
        tejabi: {
            pricePerTola: 0,
            pricePer10Grm: 0,
            pricePerGram: 0
        }
    };
    const silver = {
        pricePerTola: 2580,
        pricePer10Grm: 2212,
        pricePerGram: 221.2
    };
    return { gold, silver, timestamp: new Date().toISOString(), source: 'fallback' };
};

NepalPriceManager.prototype.processGoldData = function(gold) {
    // Accept either karats map or per-tola number
    if (gold?.karats) {
        return {
            '24k': { price: gold.karats['24k'] || 0 },
            '22k': { price: gold.karats['22k'] || 0 },
            '21k': { price: gold.karats['21k'] || 0 },
            '18k': { price: gold.karats['18k'] || 0 }
        };
    }
    // Fallback shape
    const base = gold?.pricePerTola || 216000;
    return {
        '24k': { price: base },
        '22k': { price: Math.round(base * 0.917) },
        '21k': { price: Math.round(base * 0.875) },
        '18k': { price: Math.round(base * 0.75) }
    };
};

NepalPriceManager.prototype.processSilverData = function(silver) {
    if (silver?.pricePerTola) {
        return { pure: { price: silver.pricePerTola } };
    }
    if (silver?.pure?.price) return silver;
    return { pure: { price: 2580 } };
};

NepalPriceManager.prototype.updatePrices = async function(newPrices) {
    this.currentPrices = { ...(this.currentPrices || {}), ...newPrices };
    if (!this.priceHistory) this.priceHistory = [];
    this.priceHistory.unshift({ timestamp: Date.now(), prices: this.currentPrices });
    this.priceHistory = this.priceHistory.slice(0, 100);
};

NepalPriceManager.prototype.getCurrentPrices = function() {
    return this.currentPrices || {};
};

NepalPriceManager.prototype.getPriceHistory = function(days = 30) {
    return (this.priceHistory || []).slice(0, days);
};


// ============================
// script.js (Updated)
// ============================

function initializePrices() {
    const goldPriceElement = document.getElementById('gold-price');
    const silverPriceElement = document.getElementById('silver-price');
    const goldUpdateElement = document.getElementById('gold-update-time');
    const silverUpdateElement = document.getElementById('silver-update-time');

    const manager = new NepalPriceManager();

    async function updatePrices() {
        const prices = await manager.fetchLivePrices();
        const gold = prices.gold?.["24k"]?.price || 0;
        const silver = prices.silver?.pure?.price || 0;

        if (goldPriceElement) {
            goldPriceElement.querySelector('.amount').textContent = gold.toLocaleString();
        }
        if (silverPriceElement) {
            silverPriceElement.querySelector('.amount').textContent = silver.toLocaleString();
        }

        const now = new Date().toLocaleString("en-US", { hour: '2-digit', minute: '2-digit' });
        if (goldUpdateElement) goldUpdateElement.textContent = `Today ${now}`;
        if (silverUpdateElement) silverUpdateElement.textContent = `Today ${now}`;
    }

    updatePrices();
    setInterval(updatePrices, 60 * 60 * 1000); // every hour
}


// ============================
// priceAnalytics.js (Minimal Change)
// ============================
// No structural changes required, it will automatically use updated data
// from priceManager once prices are updated. Just ensure NepalPriceManager
// triggers events after updating.

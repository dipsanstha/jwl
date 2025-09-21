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

/**
 * FENEGOSIDA Price Fetcher
 * Fetches daily gold and silver prices from FENEGOSIDA.org
 * Federation of Nepal Gold and Silver Dealers' Association
 */

class FenegosidaPriceFetcher {
    constructor() {
        // API URL will be set from config.json
        this.apiUrl = '/api/nepal-gold-prices';
        this.fallbackPrices = {
            gold: {
                fine: {
                    pricePerTola: 216000,
                    pricePer10Grm: 185185,
                    pricePerGram: 18518.5
                },
                tejabi: {
                    pricePerTola: 0,
                    pricePer10Grm: 0,
                    pricePerGram: 0
                },
                karats: {
                    '24k': 216000,
                    '22k': 198072,
                    '21k': 189000,
                    '18k': 162000
                }
            },
            silver: {
                pricePerTola: 2580,
                pricePer10Grm: 2212,
                pricePerGram: 221.2
            }
        };
        this.lastUpdate = null;
        this.updateInterval = 5 * 60 * 1000; // 5 minutes
        this.isUpdating = false;
    }

    /**
     * Fetch prices from FENEGOSIDA via our API
     */
    async fetchPrices() {
        if (this.isUpdating) {
            console.log('Price update already in progress...');
            return;
        }

        this.isUpdating = true;
        this.showLoadingState();

        try {
            console.log('Fetching prices from FENEGOSIDA...');
            // Get the full API URL from config
            const apiBase = window.API_BASE || '';
            const fullApiUrl = apiBase + (this.apiUrl.startsWith('/') ? '' : '/') + this.apiUrl;
            const response = await fetch(fullApiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.updatePrices(data);
                this.lastUpdate = new Date();
                console.log('Prices updated successfully from FENEGOSIDA');
            } else {
                throw new Error(data.error || 'Failed to fetch prices');
            }

        } catch (error) {
            console.error('Error fetching prices:', error);
            this.showErrorState();
            this.useFallbackPrices();
        } finally {
            this.isUpdating = false;
            this.hideLoadingState();
        }
    }

    /**
     * Update the UI with fetched prices
     */
    updatePrices(data) {
        const { gold, silver, timestamp } = data;
        
        // Update Gold 24K
        this.updatePriceElement('gold-24k', {
            amount: this.formatPrice(gold.karats['24k']),
            change: this.calculateChange(gold.karats['24k']),
            unit: 'per tola'
        });

        // Update Gold 22K
        this.updatePriceElement('gold-22k', {
            amount: this.formatPrice(gold.karats['22k']),
            change: this.calculateChange(gold.karats['22k']),
            unit: 'per tola'
        });

        // Update Gold 21K
        this.updatePriceElement('gold-21k', {
            amount: this.formatPrice(gold.karats['21k']),
            change: this.calculateChange(gold.karats['21k']),
            unit: 'per tola'
        });

        // Update Gold 18K
        this.updatePriceElement('gold-18k', {
            amount: this.formatPrice(gold.karats['18k']),
            change: this.calculateChange(gold.karats['18k']),
            unit: 'per tola'
        });

        // Update Silver
        this.updatePriceElement('silver', {
            amount: this.formatPrice(silver.pricePerTola),
            change: this.calculateChange(silver.pricePerTola),
            unit: 'per tola'
        });

        // Update Fine Gold (9999) per 10grm
        this.updatePriceElement('fine-gold-10grm', {
            amount: this.formatPrice(gold.fine.pricePer10Grm),
            change: this.calculateChange(gold.fine.pricePer10Grm),
            unit: 'per 10 grm'
        });

        // Update Fine Gold (9999) per tola
        this.updatePriceElement('fine-gold-tola', {
            amount: this.formatPrice(gold.fine.pricePerTola),
            change: this.calculateChange(gold.fine.pricePerTola),
            unit: 'per tola'
        });

        // Update last updated time
        this.updateLastUpdatedTime(timestamp);
        
        // Show success message
        this.showSuccessMessage('Prices updated from FENEGOSIDA.org');
    }

    /**
     * Update individual price element
     */
    updatePriceElement(priceId, data) {
        const element = document.querySelector(`[data-price="${priceId}"]`);
        if (!element) return;

        // Update amount
        const amountElement = element.querySelector('.amount');
        if (amountElement) {
            amountElement.textContent = `NPR ${data.amount}`;
        }

        // Update unit
        const unitElement = element.querySelector('.unit');
        if (unitElement) {
            unitElement.textContent = data.unit;
        }

        // Update change indicator
        const changeElement = element.querySelector('.change-indicator');
        if (changeElement && data.change) {
            const isPositive = data.change > 0;
            changeElement.className = `change-indicator ${isPositive ? 'positive' : 'negative'}`;
            changeElement.innerHTML = `
                <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                ${isPositive ? '+' : ''}${data.change}
            `;
        }
    }

    /**
     * Format price with commas
     */
    formatPrice(price) {
        if (!price) return '0';
        return price.toLocaleString('en-US');
    }

    /**
     * Calculate price change (simplified - in real app, you'd compare with previous prices)
     */
    calculateChange(currentPrice) {
        // For demo purposes, return a random small change
        // In production, you'd compare with stored previous prices
        const change = Math.floor(Math.random() * 1000) - 500;
        return change;
    }

    /**
     * Update last updated time
     */
    updateLastUpdatedTime(timestamp) {
        const timeElement = document.querySelector('.last-updated');
        if (timeElement) {
            const date = new Date(timestamp);
            const timeString = date.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            timeElement.textContent = `Last updated: Today ${timeString}`;
        }
    }

    /**
     * Use fallback prices when API fails
     */
    useFallbackPrices() {
        console.log('Using fallback prices...');
        this.updatePrices({
            gold: this.fallbackPrices.gold,
            silver: this.fallbackPrices.silver,
            timestamp: new Date().toISOString()
        });
        this.showWarningMessage('Using cached prices - API unavailable');
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const priceSection = document.querySelector('.prices');
        if (priceSection) {
            priceSection.classList.add('loading');
        }
        
        // Add loading spinner to last updated time
        const timeElement = document.querySelector('.last-updated');
        if (timeElement) {
            timeElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating prices...';
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const priceSection = document.querySelector('.prices');
        if (priceSection) {
            priceSection.classList.remove('loading');
        }
    }

    /**
     * Show error state
     */
    showErrorState() {
        const priceSection = document.querySelector('.prices');
        if (priceSection) {
            priceSection.classList.add('error');
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show warning message
     */
    showWarningMessage(message) {
        this.showNotification(message, 'warning');
    }

    /**
     * Show notification
     */
    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.price-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `price-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
            <button class="close-notification" type="button" aria-label="Close notification" title="Close notification" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        const priceSection = document.querySelector('.prices');
        if (priceSection) {
            priceSection.insertBefore(notification, priceSection.firstChild);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Start automatic price updates
     */
    startAutoUpdate() {
        // Initial fetch
        this.fetchPrices();
        
        // Set up interval
        setInterval(() => {
            this.fetchPrices();
        }, this.updateInterval);
    }

    /**
     * Manual refresh
     */
    refresh() {
        this.fetchPrices();
    }
}

// Initialize price fetcher when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const priceFetcher = new FenegosidaPriceFetcher();
    
    // Start automatic updates
    priceFetcher.startAutoUpdate();
    
    // Add refresh button functionality
    const refreshButton = document.querySelector('.refresh-prices');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            priceFetcher.refresh();
        });
    }
    
    // Make it globally available for manual refresh
    window.priceFetcher = priceFetcher;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FenegosidaPriceFetcher;
}

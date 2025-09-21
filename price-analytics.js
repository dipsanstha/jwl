/**
 * Price Analytics and Trend Charts
 * Interactive charts for gold and silver price analysis
 */

class PriceAnalytics {
    constructor() {
        this.charts = {};
        this.priceHistory = [];
        this.analysisData = {};
        this.init();
    }

    init() {
        this.loadPriceHistory();
        this.setupCharts();
        this.updateAnalytics();
    }

    /**
     * Load price history data
     */
    loadPriceHistory() {
        // Sample price history data (in real app, this would come from API)
        this.priceHistory = [
            { date: '2025-01-01', gold24k: 210000, gold22k: 192500, gold21k: 183750, gold18k: 157500, silver: 2650 },
            { date: '2025-01-02', gold24k: 211500, gold22k: 194000, gold21k: 185250, gold18k: 158750, silver: 2680 },
            { date: '2025-01-03', gold24k: 209500, gold22k: 192000, gold21k: 183250, gold18k: 157000, silver: 2620 },
            { date: '2025-01-04', gold24k: 213000, gold22k: 195250, gold21k: 186500, gold18k: 159750, silver: 2710 },
            { date: '2025-01-05', gold24k: 214500, gold22k: 196500, gold21k: 187750, gold18k: 161000, silver: 2730 },
            { date: '2025-01-06', gold24k: 212000, gold22k: 194250, gold21k: 185500, gold18k: 159000, silver: 2690 },
            { date: '2025-01-07', gold24k: 216000, gold22k: 198000, gold21k: 189000, gold18k: 162000, silver: 2580 },
            { date: '2025-01-08', gold24k: 215500, gold22k: 197500, gold21k: 188500, gold18k: 161500, silver: 2590 },
            { date: '2025-01-09', gold24k: 217000, gold22k: 199000, gold21k: 190000, gold18k: 163000, silver: 2600 },
            { date: '2025-01-10', gold24k: 216500, gold22k: 198500, gold21k: 189500, gold18k: 162500, silver: 2585 },
            { date: '2025-01-11', gold24k: 218000, gold22k: 200000, gold21k: 191000, gold18k: 164000, silver: 2610 },
            { date: '2025-01-12', gold24k: 217500, gold22k: 199500, gold21k: 190500, gold18k: 163500, silver: 2605 },
            { date: '2025-01-13', gold24k: 219000, gold22k: 201000, gold21k: 192000, gold18k: 165000, silver: 2620 },
            { date: '2025-01-14', gold24k: 218500, gold22k: 200500, gold21k: 191500, gold18k: 164500, silver: 2615 },
            { date: '2025-01-15', gold24k: 220000, gold22k: 202000, gold21k: 193000, gold18k: 166000, silver: 2630 }
        ];
    }

    /**
     * Setup Chart.js configurations
     */
    setupCharts() {
        // Chart.js configuration
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = '#666';

        this.setupPriceTrendChart();
        this.setupPriceComparisonChart();
        this.setupVolatilityChart();
        this.setupMovingAverageChart();
    }

    /**
     * Setup price trend chart
     */
    setupPriceTrendChart() {
        const ctx = document.getElementById('priceTrendChart');
        if (!ctx) return;

        const labels = this.priceHistory.map(item => this.formatDate(item.date));
        const gold24kData = this.priceHistory.map(item => item.gold24k);
        const gold22kData = this.priceHistory.map(item => item.gold22k);
        const silverData = this.priceHistory.map(item => item.silver);

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Gold 24K',
                        data: gold24kData,
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Gold 22K',
                        data: gold22kData,
                        borderColor: '#ffed4e',
                        backgroundColor: 'rgba(255, 237, 78, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Silver',
                        data: silverData,
                        borderColor: '#c0c0c0',
                        backgroundColor: 'rgba(192, 192, 192, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Price Trends (Last 15 Days)',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': NPR ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Gold Price (NPR)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'NPR ' + value.toLocaleString();
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Silver Price (NPR)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            callback: function(value) {
                                return 'NPR ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Setup price comparison chart
     */
    setupPriceComparisonChart() {
        const ctx = document.getElementById('priceComparisonChart');
        if (!ctx) return;

        const latest = this.priceHistory[this.priceHistory.length - 1];
        const previous = this.priceHistory[this.priceHistory.length - 2];

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Gold 24K', 'Gold 22K', 'Gold 21K', 'Gold 18K', 'Silver'],
                datasets: [
                    {
                        label: 'Previous Day',
                        data: [previous.gold24k, previous.gold22k, previous.gold21k, previous.gold18k, previous.silver],
                        backgroundColor: 'rgba(108, 117, 125, 0.6)',
                        borderColor: 'rgba(108, 117, 125, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Current Day',
                        data: [latest.gold24k, latest.gold22k, latest.gold21k, latest.gold18k, latest.silver],
                        backgroundColor: [
                            'rgba(255, 215, 0, 0.8)',
                            'rgba(255, 237, 78, 0.8)',
                            'rgba(255, 193, 7, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(192, 192, 192, 0.8)'
                        ],
                        borderColor: [
                            'rgba(255, 215, 0, 1)',
                            'rgba(255, 237, 78, 1)',
                            'rgba(255, 193, 7, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(192, 192, 192, 1)'
                        ],
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Price Comparison (Current vs Previous Day)',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': NPR ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return 'NPR ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Setup volatility chart
     */
    setupVolatilityChart() {
        const ctx = document.getElementById('volatilityChart');
        if (!ctx) return;

        const volatilityData = this.calculateVolatility();
        
        this.charts.volatility = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low Volatility', 'Medium Volatility', 'High Volatility'],
                datasets: [{
                    data: volatilityData,
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(220, 53, 69, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Price Volatility Analysis',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    /**
     * Setup moving average chart
     */
    setupMovingAverageChart() {
        const ctx = document.getElementById('movingAverageChart');
        if (!ctx) return;

        const labels = this.priceHistory.map(item => this.formatDate(item.date));
        const gold24kData = this.priceHistory.map(item => item.gold24k);
        const movingAverage5 = this.calculateMovingAverage(gold24kData, 5);
        const movingAverage10 = this.calculateMovingAverage(gold24kData, 10);

        this.charts.movingAverage = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Gold 24K Price',
                        data: gold24kData,
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: '5-Day Moving Average',
                        data: movingAverage5,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: '10-Day Moving Average',
                        data: movingAverage10,
                        borderColor: '#4ecdc4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Moving Average Analysis (Gold 24K)',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': NPR ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return 'NPR ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Calculate price volatility
     */
    calculateVolatility() {
        const gold24kPrices = this.priceHistory.map(item => item.gold24k);
        const returns = [];
        
        for (let i = 1; i < gold24kPrices.length; i++) {
            returns.push((gold24kPrices[i] - gold24kPrices[i-1]) / gold24kPrices[i-1]);
        }
        
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
        const volatility = Math.sqrt(variance) * 100;
        
        if (volatility < 1) return [1, 0, 0]; // Low volatility
        if (volatility < 3) return [0, 1, 0]; // Medium volatility
        return [0, 0, 1]; // High volatility
    }

    /**
     * Calculate moving average
     */
    calculateMovingAverage(data, period) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else {
                const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
                result.push(sum / period);
            }
        }
        return result;
    }

    /**
     * Update analytics data
     */
    updateAnalytics() {
        this.calculatePriceChanges();
        this.calculateTrends();
        this.updateAnalyticsDisplay();
    }

    /**
     * Calculate price changes
     */
    calculatePriceChanges() {
        const latest = this.priceHistory[this.priceHistory.length - 1];
        const previous = this.priceHistory[this.priceHistory.length - 2];
        const weekAgo = this.priceHistory[this.priceHistory.length - 8];

        this.analysisData = {
            daily: {
                gold24k: latest.gold24k - previous.gold24k,
                gold22k: latest.gold22k - previous.gold22k,
                gold21k: latest.gold21k - previous.gold21k,
                gold18k: latest.gold18k - previous.gold18k,
                silver: latest.silver - previous.silver
            },
            weekly: {
                gold24k: latest.gold24k - weekAgo.gold24k,
                gold22k: latest.gold22k - weekAgo.gold22k,
                gold21k: latest.gold21k - weekAgo.gold21k,
                gold18k: latest.gold18k - weekAgo.gold18k,
                silver: latest.silver - weekAgo.silver
            }
        };
    }

    /**
     * Calculate trends
     */
    calculateTrends() {
        const latest = this.priceHistory[this.priceHistory.length - 1];
        const weekAgo = this.priceHistory[this.priceHistory.length - 8];

        this.analysisData.trends = {
            gold24k: this.getTrend(latest.gold24k, weekAgo.gold24k),
            gold22k: this.getTrend(latest.gold22k, weekAgo.gold22k),
            gold21k: this.getTrend(latest.gold21k, weekAgo.gold21k),
            gold18k: this.getTrend(latest.gold18k, weekAgo.gold18k),
            silver: this.getTrend(latest.silver, weekAgo.silver)
        };
    }

    /**
     * Get trend direction
     */
    getTrend(current, previous) {
        const change = ((current - previous) / previous) * 100;
        if (change > 2) return 'strong_up';
        if (change > 0) return 'up';
        if (change < -2) return 'strong_down';
        if (change < 0) return 'down';
        return 'stable';
    }

    /**
     * Update analytics display
     */
    updateAnalyticsDisplay() {
        this.updatePriceChanges();
        this.updateTrends();
        this.updateSummary();
    }

    /**
     * Update price changes display
     */
    updatePriceChanges() {
        const dailyChanges = this.analysisData.daily;
        const weeklyChanges = this.analysisData.weekly;

        // Update daily changes
        Object.keys(dailyChanges).forEach(metal => {
            const element = document.querySelector(`[data-metal="${metal}"] .daily-change`);
            if (element) {
                const change = dailyChanges[metal];
                const isPositive = change >= 0;
                element.innerHTML = `
                    <span class="change-indicator ${isPositive ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                        NPR ${Math.abs(change).toLocaleString()}
                    </span>
                `;
            }
        });

        // Update weekly changes
        Object.keys(weeklyChanges).forEach(metal => {
            const element = document.querySelector(`[data-metal="${metal}"] .weekly-change`);
            if (element) {
                const change = weeklyChanges[metal];
                const isPositive = change >= 0;
                element.innerHTML = `
                    <span class="change-indicator ${isPositive ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                        NPR ${Math.abs(change).toLocaleString()}
                    </span>
                `;
            }
        });
    }

    /**
     * Update trends display
     */
    updateTrends() {
        const trends = this.analysisData.trends;
        
        Object.keys(trends).forEach(metal => {
            const element = document.querySelector(`[data-metal="${metal}"] .trend-indicator`);
            if (element) {
                const trend = trends[metal];
                const trendText = this.getTrendText(trend);
                const trendClass = this.getTrendClass(trend);
                
                element.innerHTML = `
                    <span class="trend-badge ${trendClass}">
                        <i class="fas fa-${this.getTrendIcon(trend)}"></i>
                        ${trendText}
                    </span>
                `;
            }
        });
    }

    /**
     * Get trend text
     */
    getTrendText(trend) {
        const texts = {
            strong_up: 'Strong Upward',
            up: 'Upward',
            stable: 'Stable',
            down: 'Downward',
            strong_down: 'Strong Downward'
        };
        return texts[trend] || 'Unknown';
    }

    /**
     * Get trend class
     */
    getTrendClass(trend) {
        const classes = {
            strong_up: 'trend-strong-up',
            up: 'trend-up',
            stable: 'trend-stable',
            down: 'trend-down',
            strong_down: 'trend-strong-down'
        };
        return classes[trend] || 'trend-unknown';
    }

    /**
     * Get trend icon
     */
    getTrendIcon(trend) {
        const icons = {
            strong_up: 'arrow-up',
            up: 'arrow-up',
            stable: 'minus',
            down: 'arrow-down',
            strong_down: 'arrow-down'
        };
        return icons[trend] || 'question';
    }

    /**
     * Update summary
     */
    updateSummary() {
        const latest = this.priceHistory[this.priceHistory.length - 1];
        const summary = document.getElementById('priceSummary');
        if (summary) {
            summary.innerHTML = `
                <div class="summary-item">
                    <h4>Current Gold 24K</h4>
                    <p>NPR ${latest.gold24k.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Current Silver</h4>
                    <p>NPR ${latest.silver.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Market Status</h4>
                    <p class="market-status">Active</p>
                </div>
            `;
        }
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /**
     * Refresh all charts
     */
    refreshCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update();
            }
        });
    }

    /**
     * Export data
     */
    exportData() {
        const dataStr = JSON.stringify(this.priceHistory, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'price-history.json';
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.priceAnalytics = new PriceAnalytics();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriceAnalytics;
}

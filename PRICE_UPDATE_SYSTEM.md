# Daily Price Update System - New Madi Jewellers

A comprehensive real-time price management system for gold and silver ornaments in the Nepali market, featuring automatic updates, historical tracking, price alerts, and analytics.

## ✨ Features

### 🔄 **Daily Price Updates**
- **Automatic Updates**: Fetches live prices every 30 minutes during market hours (9 AM - 5 PM Nepal time)
- **Multiple Sources**: Integrates with FNEGO, international gold/silver APIs, and currency exchange rates
- **Manual Override**: Admin panel for manual price updates when needed
- **Historical Tracking**: Maintains 30-day price history with trend analysis

### 📊 **Real-time Analytics**
- **Interactive Charts**: Gold and silver price trend visualization using Chart.js
- **Market Insights**: AI-generated market analysis and buying recommendations
- **Price Calculator**: Real-time ornament price calculation with making charges
- **Comparison Tools**: Side-by-side price trend comparisons

### 🔔 **Smart Notifications**
- **Price Alerts**: Email/SMS notifications for significant price changes (1%+ threshold)
- **Daily Summaries**: End-of-day price reports for subscribers
- **Weekly Reports**: Comprehensive market analysis reports
- **Browser Notifications**: Real-time alerts for website visitors

### ⚙️ **Admin Dashboard**
- **Price Management**: Manual price updates with validation
- **Subscriber Management**: View, export, and manage alert subscribers
- **System Monitoring**: Real-time system status and activity logs
- **Data Export**: Backup and export functionality for all data

## 🏗️ **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Website                            │
├─────────────────────────────────────────────────────────────┤
│  • Price Display Components                                 │
│  • Price Alert Subscription                                 │
│  • Interactive Charts & Analytics                           │
│  • Price Calculator                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Price Management System                       │
├─────────────────────────────────────────────────────────────┤
│  • NepalPriceManager Class                                  │
│  • Auto-update Scheduler                                    │
│  • Notification Engine                                      │
│  • Data Persistence                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Sources                              │
├─────────────────────────────────────────────────────────────┤
│  • FNEGO API (Federation of Nepal Gold & Silver Dealers)   │
│  • International Gold/Silver APIs                          │
│  • Currency Exchange Rate APIs                             │
│  • Manual Admin Updates                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel                              │
├─────────────────────────────────────────────────────────────┤
│  • Manual Price Updates                                    │
│  • Subscriber Management                                   │
│  • System Configuration                                    │
│  • Analytics & Reporting                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 **Quick Start**

### 1. **File Structure**
Ensure your project has the following structure:
```
new-madi-jewellers/
├── index.html                 # Main website
├── admin.html                 # Admin panel
├── css/
│   └── style.css             # Main stylesheet
├── js/
│   ├── script.js             # Main website functionality
│   ├── priceManager.js       # Price management system
│   └── priceAnalytics.js     # Analytics and charts
├── data/
│   └── prices.json           # Price data storage
└── images/                   # Image assets
```

### 2. **Dependencies**
The system uses these external libraries (loaded via CDN):
- **Chart.js**: For price trend visualizations
- **Font Awesome**: For icons
- **Google Fonts**: For typography

### 3. **Basic Setup**
1. Open `index.html` in a web browser to see the main website
2. Open `admin.html` in a separate tab for the admin panel
3. The system will automatically initialize and start simulating price updates

## ⚙️ **Configuration**

### **System Settings**
Configure the price update system through the admin panel or by modifying `priceManager.js`:

```javascript
// Update frequency (minutes)
const UPDATE_FREQUENCY = 30;

// Price change alert threshold (percentage)
const ALERT_THRESHOLD = 1.0;

// Market hours (Nepal time)
const MARKET_HOURS = {
    start: 9,  // 9 AM
    end: 17    // 5 PM
};

// API endpoints
const API_ENDPOINTS = {
    fnego: 'https://api.fnego.org.np/prices',
    goldapi: 'https://goldapi.io/api/XAU/NPR',
    silverapi: 'https://api.metals.live/v1/spot/silver',
    exchangeRate: 'https://api.exchangerate-api.com/v4/latest/USD'
};
```

### **Price Data Structure**
The system stores prices in this format:
```json
{
  "currentPrices": {
    "gold": {
      "24k": { "price": 155500, "change": "+500", "changePercent": "+0.32%" },
      "22k": { "price": 142500, "change": "+450", "changePercent": "+0.32%" },
      "21k": { "price": 136000, "change": "+400", "changePercent": "+0.29%" },
      "18k": { "price": 116500, "change": "+350", "changePercent": "+0.30%" }
    },
    "silver": {
      "pure": { "price": 1850, "change": "-5", "changePercent": "-0.27%" }
    }
  },
  "priceHistory": [
    {
      "date": "2025-09-20",
      "gold24k": 155500,
      "gold22k": 142500,
      "gold21k": 136000,
      "gold18k": 116500,
      "silver": 1850,
      "source": "Live Update"
    }
  ]
}
```

## 🔧 **API Integration**

### **Real API Implementation**
To connect to actual price feeds, replace the simulation functions in `priceManager.js`:

#### **FNEGO API Integration**
```javascript
async fetchGoldPrices() {
    try {
        const response = await fetch('https://api.fnego.org.np/prices');
        const data = await response.json();
        
        return {
            "24k": data.gold.pure,
            "22k": data.gold.pure * 0.917,
            "21k": data.gold.pure * 0.875,
            "18k": data.gold.pure * 0.75,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('FNEGO API error:', error);
        throw error;
    }
}
```

#### **International Gold API**
```javascript
async fetchInternationalGoldPrice() {
    try {
        const response = await fetch('https://goldapi.io/api/XAU/NPR', {
            headers: {
                'x-access-token': 'YOUR_GOLDAPI_TOKEN'
            }
        });
        const data = await response.json();
        
        return {
            pricePerTola: data.price_gram_24k * 11.664, // Convert to tola
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Gold API error:', error);
        throw error;
    }
}
```

### **Email/SMS Notifications**
Implement actual notification delivery by replacing the notification functions:

#### **Email Integration (using EmailJS)**
```javascript
async sendEmailNotification(subscriber, message) {
    try {
        await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            {
                to_email: subscriber.email,
                message: message,
                subject: 'Price Alert - New Madi Jewellers'
            },
            'YOUR_USER_ID'
        );
        
        console.log(`Email sent to ${subscriber.email}`);
    } catch (error) {
        console.error('Email send error:', error);
    }
}
```

#### **SMS Integration (using Twilio)**
```javascript
async sendSMSNotification(phoneNumber, message) {
    try {
        const response = await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: phoneNumber,
                message: message
            })
        });
        
        if (response.ok) {
            console.log(`SMS sent to ${phoneNumber}`);
        }
    } catch (error) {
        console.error('SMS send error:', error);
    }
}
```

## 📱 **Frontend Integration**

### **Price Display Components**
The system automatically updates price displays with the `data-price` attribute:

```html
<!-- Gold price display -->
<div class="price-card" data-price="gold-24k">
    <h3>Gold 24K</h3>
    <div class="price-value">
        <span class="amount">NPR 155,500</span>
        <span class="unit">per tola</span>
    </div>
    <div class="price-change">
        <span class="change positive">+0.32%</span>
    </div>
</div>

<!-- Silver price display -->
<div class="price-card" data-price="silver">
    <h3>Silver</h3>
    <div class="price-value">
        <span class="amount">NPR 1,850</span>
        <span class="unit">per tola</span>
    </div>
    <div class="price-change">
        <span class="change negative">-0.27%</span>
    </div>
</div>
```

### **Price Alert Subscription**
Users can subscribe to price alerts through the automatically generated form:

```javascript
// Subscription is handled automatically by priceManager.js
// The form appears in the prices section when the page loads

// Manual subscription via JavaScript:
await nepalPriceManager.subscribeToAlerts('user@example.com', {
    goldThreshold: 1.0,
    silverThreshold: 1.0,
    dailyUpdate: true,
    weeklyReport: true
});
```

### **Analytics Integration**
Charts and analytics are automatically generated when `priceAnalytics.js` is loaded:

```javascript
// Access price analytics
const analytics = window.priceAnalytics;

// Get price statistics
const goldStats = analytics.calculateStats([155500, 155000, 154800]);
// Returns: { max: 155500, min: 154800, avg: 155100 }

// Calculate trend
const trend = analytics.calculateTrend([154800, 155000, 155500]);
// Returns: 0.45 (0.45% increase)
```

## 🛠️ **Admin Panel Features**

### **Manual Price Updates**
1. **Access**: Open `admin.html` in your browser
2. **Login**: No authentication required (add authentication for production)
3. **Update Prices**: Fill in current prices and click "Update Prices"
4. **Fetch Live**: Click "Fetch Live Prices" to get data from APIs

### **Subscriber Management**
- **View All**: See all price alert subscribers
- **Export CSV**: Download subscriber list
- **Remove**: Delete individual subscribers
- **Statistics**: View subscription analytics

### **System Monitoring**
- **Real-time Status**: Monitor system health
- **Activity Log**: Track all system activities
- **Settings**: Configure update frequency and alert thresholds
- **Backup**: Export all system data

## 📈 **Analytics Dashboard**

### **Price Trends**
- **Gold Chart**: 24K gold price movement over time
- **Silver Chart**: Silver price trends
- **Comparison**: Side-by-side gold vs silver analysis
- **Statistics**: High, low, and average prices

### **Market Insights**
- **Trend Analysis**: Automatic trend detection
- **Buying Recommendations**: Best time to buy suggestions
- **Volatility Analysis**: Price stability indicators
- **Market Hours**: Optimal trading time recommendations

### **Price Calculator**
- **Real-time Calculation**: Instant ornament pricing
- **Making Charges**: Configurable additional costs
- **Multiple Metals**: Gold (24K, 22K, 21K, 18K) and Silver
- **Weight Converter**: Support for tola measurements

## 🔒 **Security & Production**

### **Security Considerations**
1. **API Keys**: Store API keys securely (environment variables)
2. **Authentication**: Add admin panel authentication
3. **HTTPS**: Use SSL certificates for production
4. **Input Validation**: Sanitize all user inputs
5. **Rate Limiting**: Prevent API abuse

### **Production Deployment**
1. **Server Setup**: Use Node.js, Apache, or Nginx
2. **Database**: Replace JSON storage with MySQL/PostgreSQL
3. **Caching**: Implement Redis for better performance
4. **Monitoring**: Add error logging and alerts
5. **Backup**: Regular automated backups

### **Environment Variables**
Create a `.env` file for production:
```env
FNEGO_API_KEY=your_fnego_api_key
GOLD_API_KEY=your_gold_api_key
SILVER_API_KEY=your_silver_api_key
EMAIL_API_KEY=your_email_service_key
SMS_API_KEY=your_sms_service_key
DATABASE_URL=your_database_connection_string
```

## 📊 **Performance Optimization**

### **Caching Strategy**
```javascript
// Implement caching for API responses
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let priceCache = {
    data: null,
    timestamp: null
};

async function getCachedPrices() {
    const now = Date.now();
    if (priceCache.data && (now - priceCache.timestamp) < CACHE_DURATION) {
        return priceCache.data;
    }
    
    const freshData = await fetchLivePrices();
    priceCache = { data: freshData, timestamp: now };
    return freshData;
}
```

### **Database Optimization**
```sql
-- Indexes for better query performance
CREATE INDEX idx_price_history_date ON price_history(date);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_price_alerts_timestamp ON price_alerts(timestamp);
```

## 🎯 **Monitoring & Alerts**

### **System Health Checks**
```javascript
// Add health monitoring
class SystemMonitor {
    async checkHealth() {
        return {
            apiStatus: await this.checkAPIConnectivity(),
            databaseStatus: await this.checkDatabase(),
            lastUpdate: this.getLastUpdateTime(),
            activeSubscribers: this.getSubscriberCount(),
            systemUptime: process.uptime()
        };
    }
}
```

### **Error Handling**
```javascript
// Comprehensive error handling
try {
    await updatePrices();
} catch (error) {
    // Log error
    console.error('Price update failed:', error);
    
    // Send admin alert
    await sendAdminAlert('Price Update Failed', error.message);
    
    // Use fallback data
    await loadFallbackPrices();
}
```

## 🤝 **Contributing**

To contribute to the price update system:

1. **Fork** the repository
2. **Create** a feature branch
3. **Add** your improvements
4. **Test** thoroughly
5. **Submit** a pull request

## 📞 **Support**

For technical support or questions:
- **Email**: tech@newmadijewellers.com
- **Documentation**: See inline code comments
- **Issues**: Report bugs through the admin panel

## 📄 **License**

This price update system is proprietary software created for New Madi Jewellers. All rights reserved.

---

**Made with ❤️ for accurate and timely precious metal pricing in Nepal**
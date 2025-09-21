# Nepal Gold & Silver Price Scraper

A real-time price scraping service for Nepal gold and silver prices from GoldPriceZ.com. This solves CORS issues by running the web scraping on the server side and providing a clean API interface for your frontend.

## Features

- **Real-time price fetching** from GoldPriceZ.com
- **Multiple karat gold prices** (24K, 22K, 21K, 18K) 
- **Silver price tracking** with proper unit conversions
- **Caching system** (5-minute cache to avoid excessive requests)
- **Fallback data** when scraping fails
- **CORS-enabled** API for frontend integration
- **Health check endpoint** for monitoring

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3001`

### 3. Test the API

```bash
npm test
```

## API Endpoints

### Get Nepal Gold & Silver Prices
```
GET /api/nepal-gold-prices
```

**Response:**
```json
{
  "success": true,
  "cached": false,
  "timestamp": "2025-09-20T14:44:01.000Z",
  "gold": {
    "pricePerGram": 16714.38,
    "pricePerTola": 194958,
    "weeklyChange": "+190.45",
    "karats": {
      "24k": 194958,
      "22k": 178756,
      "21k": 170589,
      "18k": 146219
    },
    "source": "GoldPriceZ.com",
    "timestamp": "2025-09-20T14:44:01.000Z"
  },
  "silver": {
    "pricePerKg": 195487.03,
    "pricePerTola": 2278,
    "source": "GoldPriceZ.com",
    "timestamp": "2025-09-20T14:44:01.000Z"
  }
}
```

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-20T14:44:01.000Z",
  "cache": {
    "hasData": true,
    "lastUpdated": 1726854241000,
    "age": 30000
  }
}
```

## How It Works

1. **Web Scraping**: The server fetches HTML pages from GoldPriceZ.com using Axios and Cheerio
2. **Price Extraction**: Uses multiple CSS selectors and regex patterns to find gold and silver prices
3. **Unit Conversion**: Converts from grams to tola (1 tola = 11.664 grams) for gold, kg to tola for silver
4. **Karat Calculation**: Calculates different gold purities (22K = 91.7%, 21K = 87.5%, 18K = 75%)
5. **Caching**: Stores results for 5 minutes to reduce load on GoldPriceZ.com
6. **Fallback**: Provides realistic fallback prices when scraping fails

## Frontend Integration

Your existing JavaScript price manager will automatically use this API through the `fetchFromLocalAPI()` method:

```javascript
// This is already implemented in your priceManager.js
const response = await fetch('http://localhost:3001/api/nepal-gold-prices');
const data = await response.json();

if (data.success) {
    // Use real-time prices from GoldPriceZ.com
    updatePrices(data);
}
```

## Deployment Options

### Option 1: Local Development
Run the server locally alongside your website during development.

### Option 2: VPS/Cloud Deployment
Deploy to services like:
- **DigitalOcean Droplet** ($6/month)
- **AWS EC2** (free tier available)
- **Heroku** (free tier with limitations)
- **Vercel** (free for API routes)

### Option 3: Serverless Functions
Convert to serverless for platforms like:
- Vercel API Routes
- Netlify Functions  
- AWS Lambda

## Configuration

### Change Port
```bash
PORT=8080 npm start
```

### Configure CORS Origins
Edit `price-scraper.js`:
```javascript
app.use(cors({
    origin: ['http://localhost', 'https://yourdomain.com'],
    credentials: true
}));
```

### Adjust Cache Duration
Edit the cache duration in `price-scraper.js`:
```javascript
let priceCache = {
    cacheDuration: 10 * 60 * 1000 // 10 minutes
};
```

## Error Handling

The system includes multiple layers of error handling:

1. **Network Errors**: Timeout after 10 seconds
2. **Parsing Errors**: Multiple fallback extraction methods
3. **Price Validation**: Checks if prices are in reasonable ranges
4. **Fallback Data**: Returns realistic backup prices when all else fails

## Monitoring

### Check Server Health
```bash
curl http://localhost:3001/health
```

### View Logs
The server logs all scraping attempts and errors to the console.

### Monitor Cache Performance
The health endpoint shows cache statistics to help optimize performance.

## Troubleshooting

### Server Won't Start
- Check if port 3001 is available
- Install dependencies: `npm install`
- Check Node.js version (requires Node 14+)

### Prices Not Updating
- Check if GoldPriceZ.com is accessible
- Verify the HTML structure hasn't changed
- Check server logs for parsing errors

### CORS Errors
- Ensure your frontend origin is in the CORS configuration
- Check that the server is running and accessible

### Cache Issues
- Restart the server to clear cache
- Adjust cache duration if needed
- Check the health endpoint for cache status

## Production Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Add API keys for production use
3. **Monitoring**: Add proper logging and monitoring
4. **SSL**: Use HTTPS in production
5. **Load Balancing**: Use multiple instances for high availability

## Example Usage in Your Website

Your existing price manager will now automatically fetch real prices:

```javascript
// This happens automatically every 30 minutes
const priceManager = new NepalPriceManager();

// Prices will now show:
// 24K Gold: NPR 1,94,958 per tola (Real-time from GoldPriceZ.com)
// Silver: NPR 2,278 per tola (Real-time from GoldPriceZ.com)
```

## License

MIT License - feel free to modify and use for your business needs.

---

**Ready to get real-time Nepal gold and silver prices on your website!** 🏆💰
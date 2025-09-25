// Test script to verify the price scraper functionality
const axios = require('axios');

async function testPriceScraper() {
    try {
        console.log('Testing Nepal price scraper API...\n');
        
        // Test the API endpoint
        const response = await axios.get('http://localhost:3001/api/nepal-gold-prices');
        const data = response.data;
        
        console.log('✅ API Response Status:', response.status);
        console.log('✅ API Success:', data.success);
        console.log('✅ Cached:', data.cached);
        console.log('✅ Timestamp:', data.timestamp);
        
        if (data.gold) {
            console.log('\n--- GOLD PRICES ---');
            console.log('24K Gold per Tola: NPR', data.gold.karats['24k'].toLocaleString());
            console.log('22K Gold per Tola: NPR', data.gold.karats['22k'].toLocaleString());
            console.log('21K Gold per Tola: NPR', data.gold.karats['21k'].toLocaleString());
            console.log('18K Gold per Tola: NPR', data.gold.karats['18k'].toLocaleString());
            console.log('Price per Gram: NPR', data.gold.pricePerGram?.toLocaleString() || 'N/A');
            console.log('Weekly Change:', data.gold.weeklyChange || 'N/A');
            console.log('Source:', data.gold.source);
        } else {
            console.log('❌ No gold price data received');
        }
        
        if (data.silver) {
            console.log('\n--- SILVER PRICES ---');
            console.log('Pure Silver per Tola: NPR', data.silver.pricePerTola.toLocaleString());
            console.log('Price per Kg: NPR', data.silver.pricePerKg?.toLocaleString() || 'N/A');
            console.log('Source:', data.silver.source);
        } else {
            console.log('❌ No silver price data received');
        }
        
        console.log('\n✅ Test completed successfully!');
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Error: Price scraper server is not running!');
            console.log('\n📝 To start the server:');
            console.log('1. Navigate to the server directory: cd server');
            console.log('2. Install dependencies: npm install');
            console.log('3. Start the server: npm start');
            console.log('4. Then run this test again: npm test');
        } else {
            console.error('❌ Test failed:', error.message);
            if (error.response) {
                console.log('Response data:', error.response.data);
            }
        }
    }
}

// Test health endpoint
async function testHealthEndpoint() {
    try {
        console.log('\n--- Testing Health Endpoint ---');
        const response = await axios.get('http://localhost:3001/health');
        console.log('✅ Health Status:', response.data.status);
        console.log('✅ Server Time:', response.data.timestamp);
        console.log('✅ Cache Info:', response.data.cache);
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
    }
}

// Run the tests
async function runAllTests() {
    await testHealthEndpoint();
    await testPriceScraper();
}

runAllTests();
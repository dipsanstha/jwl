# New Madi Jewellers Website

A modern, elegant, and responsive website for New Madi Jewellers, a traditional Nepali jewellery shop located in Bharatpur, Nepal.

## ✨ Features

### 🏪 Business Information
- **Shop Name**: New Madi Jewellers
- **Location**: Bharatpur, Chitwan, Nepal
- **Tagline**: "Where Tradition Meets Elegance"

### 🎨 Design Features
- **Theme**: Gold & White with elegant Nepali-inspired patterns
- **Typography**: Playfair Display (serif) for headings, Inter (sans-serif) for body text
- **Responsive Design**: Mobile-first approach, works on all devices
- **Modern Animations**: Smooth transitions and scroll effects

### 📱 Sections Included
1. **Header & Navigation** - Fixed header with smooth scrolling navigation
2. **Hero Section** - Eye-catching banner with call-to-action
3. **About Us** - Shop information and key features
4. **Ornaments Showcase** - Filterable gallery of jewellery categories
5. **Real-time Prices** - Live gold and silver prices in NPR
6. **Customer Testimonials** - Social proof from satisfied customers
7. **Contact Section** - Contact form and shop information
8. **Footer** - Links, social media, and copyright information

### 💎 Jewellery Categories
- **Gold Jewellery** - Traditional and modern gold ornaments
- **Silver Jewellery** - Handcrafted silver pieces
- **Diamond Jewellery** - Sparkling diamond rings and sets
- **Bridal Collection** - Complete bridal ornament sets
- **Traditional Nepali** - Tilhari, Nathiya, Mangalsutra, Chura

### 🚀 Interactive Features
- Category filtering for ornament showcase
- Real-time price updates (simulated)
- Contact form with validation
- Smooth scrolling navigation
- Mobile-responsive hamburger menu
- Price alert subscription system
- Search functionality
- Social media integration

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, and animations  
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Playfair Display & Inter)

## 📁 Project Structure

```
jwl/
│
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── script.js       # JavaScript functionality
├── images/
│   ├── hero-bg.jpg     # Hero section background
│   ├── about-bg.jpg    # About section background
│   ├── ornaments/      # Jewellery product images
│   └── testimonials/   # Customer testimonial images
├── assets/             # Additional assets
└── README.md          # This file
```

## 🚀 Getting Started

### Method 1: Direct File Opening
1. Navigate to the project folder
2. Double-click on `index.html` to open in your default browser

### Method 2: Local Development Server (Recommended)

#### Using Python (if installed):
```bash
# Navigate to project directory
cd jwl

# Python 3
python -m http.server 8000

# Python 2 (deprecated)
python -m SimpleHTTPServer 8000

# Then open http://localhost:8000 in your browser
```

#### Using Node.js:
```bash
# Install a simple server globally
npm install -g http-server

# Navigate to project directory and run
cd jwl
http-server

# Then open http://localhost:8080 in your browser
```

#### Using PHP (if installed):
```bash
# Navigate to project directory
cd jwl
php -S localhost:8000

# Then open http://localhost:8000 in your browser
```

### Method 3: Live Server (VS Code Extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px  
- **Mobile**: 767px and below
- **Small Mobile**: 480px and below

## 🎨 Color Palette

- **Primary Gold**: #FFD700
- **Dark Gold**: #B8860B  
- **White**: #FEFEFE
- **Light Gray**: #FAFAFA
- **Dark Gray**: #333333
- **Text Gray**: #666666

## 📞 Contact Information

- **Address**: Bharatpur, Chitwan, Nepal
- **Phone**: +977-56-123456
- **Mobile**: +977-9845123456
- **WhatsApp**: +977-9845123456
- **Email**: info@newmadijewellers.com

## 🌟 Key Features Implementation

### Real-time Price Updates
- Simulates live gold/silver price fetching
- Updates every 5 minutes
- Price change indicators
- NPR currency formatting

### Ornament Filtering System
- Category-based filtering
- Smooth animations
- Search functionality
- Responsive grid layout

### Contact Form
- Form validation
- Loading states
- Success/error notifications
- Phone number formatting for Nepal

### Mobile Navigation
- Hamburger menu
- Touch-friendly interactions
- Smooth animations
- Outside-click closing

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
:root {
  --primary-gold: #FFD700;
  --dark-gold: #B8860B;
  --white: #FEFEFE;
}
```

### Adding Real Images
1. Replace placeholder images in the `images/` folder
2. Update image paths in `index.html`
3. Ensure proper alt text for accessibility
4. Optimize images for web (recommended: WebP format)
5. Use appropriate image dimensions for different screen sizes

### API Integration
- Replace simulated price updates with real API calls
- Implement actual contact form backend
- Add payment gateway integration

## 📈 Performance Optimizations

- **CSS and JS minification**: Ready for production builds
- **Image optimization**: Use WebP format and appropriate sizing
- **Lazy loading**: Implemented for images and content
- **Caching**: Browser caching headers recommended
- **PWA ready**: Service worker implementation available
- **CDN ready**: Static assets can be served from CDN

## 🔒 Security Considerations

- **Form validation**: Implemented on client-side (server-side validation required for production)
- **XSS protection**: Input sanitization in form fields
- **HTTPS**: Required for production deployment
- **API security**: Secure API key management for price feeds
- **Content Security Policy**: Recommended for production
- **Input validation**: All user inputs are validated and sanitized

## 📄 License

This project is created for New Madi Jewellers. All rights reserved.

## 🚀 Deployment

### For Production Deployment:
1. **Optimize assets**: Minify CSS and JavaScript files
2. **Compress images**: Use WebP format and appropriate compression
3. **Configure server**: Set up proper caching headers
4. **SSL Certificate**: Ensure HTTPS is enabled
5. **Test thoroughly**: Check all features across different devices

### Recommended Hosting Platforms:
- **Netlify**: Easy deployment with form handling
- **Vercel**: Fast static site hosting
- **GitHub Pages**: Free hosting for static sites
- **Traditional web hosting**: Any provider supporting HTML/CSS/JS

## 🤝 Contributing

For modifications or improvements, please contact the development team.

## 📞 Support

For technical support or questions about this website:
- **Email**: support@newmadijewellers.com
- **Phone**: +977-56-123456

---

**Made with ❤️ for preserving Nepali tradition in modern digital format**

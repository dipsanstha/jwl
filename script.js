// ============================
// New Madi Jewellers - JavaScript
// Interactive functionality
// ============================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeOrnamentFilters();
    initializePrices();
    initializeContactForm();
    initializeScrollEffects();
    initializeTestimonials();
    initializeSmoothScrolling();
});

// ============================
// Navigation Functions
// ============================
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Header background on scroll
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(184, 134, 11, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(184, 134, 11, 0.1)';
            }
        }
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================
// Ornament Filters
// ============================
function initializeOrnamentFilters() {
    const filterButtons = document.querySelectorAll('.tab-button');
    const ornamentCards = document.querySelectorAll('.ornament-card');

    // Show all cards initially
    ornamentCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with animation
            ornamentCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategories.includes(category)) {
                    // Show card
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Animate in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'all 0.5s ease';
                    }, 50);
                } else {
                    // Hide card
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // View details functionality
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.ornament-card');
            const title = card.querySelector('h3').textContent;
            const category = card.querySelector('.category-tag').textContent;
            const description = card.querySelector('p').textContent;
            
            // Enhanced modal content
            const modalContent = `
🏆 ${title}

📂 Category: ${category}

📝 Description: ${description}

💰 Price: Contact us for current pricing

📞 Call us at +977-56-123456 for more details

This would normally open a detailed product page with:
• High-resolution images
• Detailed specifications
• Current pricing
• Similar products
• Purchase options`;
            
            alert(modalContent);
        });
    });

    // Add loading animation for cards
    ornamentCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
            card.classList.add('animate-in');
        }, index * 150);
    });

    // Ensure all cards are visible initially
    setTimeout(() => {
        ornamentCards.forEach(card => {
            if (!card.classList.contains('visible')) {
                card.classList.add('visible');
            }
        });
    }, ornamentCards.length * 150 + 500);
}

// ============================
// Real-time Prices
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
// Contact Form
// ============================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Thank you for your message! We will contact you soon.', 'success');
            }, 2000);
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.startsWith('977')) {
                    value = '+977-' + value.substring(3);
                } else if (value.startsWith('9')) {
                    value = '+977-' + value;
                }
            }
            this.value = value;
        });
    }
}

// ============================
// Scroll Effects
// ============================
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.ornament-card, .testimonial-card, .price-card, .feature');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ============================
// Testimonials
// ============================
function initializeTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // Add hover effects
    testimonialCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px) scale(1)';
        });
        
        // Stagger animation on load
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 200);
    });
}

// ============================
// Smooth Scrolling
// ============================
function initializeSmoothScrolling() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================
// Utility Functions
// ============================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================
// Social Media Integration
// ============================
function initializeSocialSharing() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                const platform = this.querySelector('i').classList[1].split('-')[1];
                
                let shareUrl = '';
                const siteUrl = window.location.href;
                const siteTitle = 'New Madi Jewellers - Traditional Nepali Jewellery';
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
                        break;
                    case 'instagram':
                        // Instagram doesn't support direct sharing via URL
                        showNotification('Follow us on Instagram @newmadijewellers', 'info');
                        return;
                    case 'tiktok':
                        showNotification('Find us on TikTok @newmadijewellers', 'info');
                        return;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(siteTitle + ' - ' + siteUrl)}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            }
        });
    });
}

// ============================
// Price Alert System
// ============================
function initializePriceAlerts() {
    const alertButton = document.createElement('button');
    alertButton.innerHTML = '<i class="fas fa-bell"></i> Price Alerts';
    alertButton.className = 'price-alert-btn';
    alertButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFD700, #B8860B);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 50px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        z-index: 1000;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    alertButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
    });
    
    alertButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
    });
    
    alertButton.addEventListener('click', function() {
        const email = prompt('Enter your email to receive price alerts:');
        if (email && isValidEmail(email)) {
            showNotification('Price alert subscription successful! You will receive notifications when gold/silver prices change significantly.', 'success');
        } else if (email) {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
    
    document.body.appendChild(alertButton);
}

// ============================
// Advanced Features
// ============================

// Currency Converter (NPR to other currencies)
function initializeCurrencyConverter() {
    // This would integrate with a currency API in a real implementation
    const currencies = {
        'USD': 0.0075,  // 1 NPR = 0.0075 USD (approximate)
        'INR': 0.625,   // 1 NPR = 0.625 INR (approximate)
        'EUR': 0.007    // 1 NPR = 0.007 EUR (approximate)
    };
    
    window.convertPrice = function(priceInNPR, toCurrency) {
        if (currencies[toCurrency]) {
            return (priceInNPR * currencies[toCurrency]).toFixed(2);
        }
        return priceInNPR;
    };
}

// Search Functionality
function initializeSearch() {
    const searchButton = document.createElement('div');
    searchButton.innerHTML = '<i class="fas fa-search"></i>';
    searchButton.className = 'search-toggle';
    searchButton.style.cssText = `
        position: absolute;
        right: 80px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #B8860B;
        font-size: 1.2rem;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.3s ease;
    `;
    
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        navContainer.appendChild(searchButton);
        
        searchButton.addEventListener('click', function() {
            // Simple search implementation
            const query = prompt('Search for jewellery items:');
            if (query) {
                const ornamentCards = document.querySelectorAll('.ornament-card');
                let found = false;
                
                ornamentCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    
                    if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
                        card.style.border = '3px solid #FFD700';
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        found = true;
                    } else {
                        card.style.border = 'none';
                    }
                });
                
                if (!found) {
                    showNotification(`No items found matching "${query}"`, 'info');
                } else {
                    setTimeout(() => {
                        ornamentCards.forEach(card => {
                            card.style.border = 'none';
                        });
                    }, 3000);
                }
            }
        });
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeSocialSharing();
        initializePriceAlerts();
        initializeCurrencyConverter();
        initializeSearch();
    }, 1000);
});

// ============================
// Performance Optimization
// ============================

// Lazy loading for images (when real images are added)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add CSS animations
const additionalCSS = `
.animate-in {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s ease-out;
}

.ornament-card,
.testimonial-card,
.price-card,
.feature {
    opacity: 0;
    transform: translateY(30px);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
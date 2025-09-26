// ============================
// New Madi Jewellers - JavaScript
// Interactive functionality
// ============================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize minimal components
    initializeNavigation();
    initializeOrnamentFilters();
    initializeScrollEffects();
    initializeSmoothScrolling();
    initializeImageLightbox();
    initializeContactForm();
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
        function toggleMenu() {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        }

        hamburger.addEventListener('click', toggleMenu);
        // Keyboard accessibility for hamburger
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
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
                hamburger.setAttribute('aria-expanded', 'false');
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

    // Delegated click handling at document level so new items and other sections also work
    document.addEventListener('click', function(e) {
        // If user clicked the "View Details" button inside any ornament card
        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn && viewBtn.closest('.ornament-card')) {
            e.preventDefault();
            const card = viewBtn.closest('.ornament-card');
            const imgEl = card && card.querySelector('.card-image img');
            if (imgEl) {
                const title = (card.querySelector('.card-content h3')?.textContent || '').trim();
                const desc = (card.querySelector('.card-content p')?.textContent || '').trim();
                const category = (card.querySelector('.category-tag')?.textContent || card.dataset.category || '').trim();
                openImageLightbox({
                    src: imgEl.getAttribute('src'),
                    alt: imgEl.getAttribute('alt') || 'Ornament full view',
                    title,
                    desc,
                    category
                });
            }
            return;
        }

        // If user clicked directly on an image inside any ornament card
        if (e.target && e.target.matches('.ornament-card .card-image img')) {
            const imgEl = e.target;
            const card = imgEl.closest('.ornament-card');
            const title = (card.querySelector('.card-content h3')?.textContent || '').trim();
            const desc = (card.querySelector('.card-content p')?.textContent || '').trim();
            const category = (card.querySelector('.category-tag')?.textContent || card.dataset.category || '').trim();
            openImageLightbox({
                src: imgEl.getAttribute('src'),
                alt: imgEl.getAttribute('alt') || 'Ornament full view',
                title,
                desc,
                category
            });
        }
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
// Minimal build (prices/forms/social removed)
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
    const animateElements = document.querySelectorAll('.ornament-card, .feature');
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
// Contact Form Submission
// ============================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        return;
    }

    const statusEl = document.getElementById('contactFormStatus');
    const recipientEmail = 'info@newmadijewellers.com';

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = (contactForm.querySelector('#name')?.value || '').trim();
        const email = (contactForm.querySelector('#email')?.value || '').trim();
        const phone = (contactForm.querySelector('#phone')?.value || '').trim();
        const message = (contactForm.querySelector('#message')?.value || '').trim();

        const subject = encodeURIComponent('New Contact Form Submission');
        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || 'N/A'}`,
            `Message: ${message}`
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));

        const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

        if (statusEl) {
            statusEl.textContent = 'Opening your email client…';
        }

        window.location.href = mailtoUrl;

        setTimeout(() => {
            contactForm.reset();
            if (statusEl) {
                statusEl.textContent = 'If your email client did not open, please email us directly at info@newmadijewellers.com with your details.';
            }
        }, 500);
    });
}

// ============================
// Image Lightbox (Top-level)
// ============================
function initializeImageLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    const imgEl = lightbox.querySelector('.lightbox-image');
    const titleEl = lightbox.querySelector('.lightbox-title');
    const descEl = lightbox.querySelector('.lightbox-desc');
    const catEl = lightbox.querySelector('.lightbox-category');

    function closeLightbox() {
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
        if (imgEl) {
            imgEl.removeAttribute('src');
            imgEl.removeAttribute('alt');
        }
        if (titleEl) titleEl.textContent = '';
        if (descEl) descEl.textContent = '';
        if (catEl) catEl.textContent = '';
    }

    // Close via close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Close when clicking backdrop (only if clicking on the overlay itself)
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const isHidden = lightbox.hasAttribute('hidden');
            if (!isHidden) closeLightbox();
        }
    });

    // Expose closer for other modules if needed
    window.__closeImageLightbox = closeLightbox;
}

function openImageLightbox(data) {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;
    const imgEl = lightbox.querySelector('.lightbox-image');
    const titleEl = lightbox.querySelector('.lightbox-title');
    const descEl = lightbox.querySelector('.lightbox-desc');
    const catEl = lightbox.querySelector('.lightbox-category');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    if (imgEl) {
        imgEl.setAttribute('src', data?.src || '');
        imgEl.setAttribute('alt', data?.alt || 'Ornament full view');
    }
    if (titleEl) titleEl.textContent = data?.title || 'Ornament';
    if (descEl) descEl.textContent = data?.desc || '';
    if (catEl) catEl.textContent = (data?.category || '').toString().toUpperCase();
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (closeBtn) {
        closeBtn.focus();
    }
}

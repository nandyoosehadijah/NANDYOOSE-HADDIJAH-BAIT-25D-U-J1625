// ===================================
// TETA HILLS SECONDARY SCHOOL
// JavaScript for Interactive Features
// ===================================

// ===================================
// MOBILE MENU TOGGLE
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = document.querySelector('.nav-container').contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ===================================
    // ACTIVE NAVIGATION HIGHLIGHT
    // ===================================

    function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setActiveNav();

    // ===================================
    // CONTACT FORM HANDLING
    // ===================================

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Validate form
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Prepare message for WhatsApp
            const whatsappMessage = `*New Contact Form Submission*

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}`;

            // Send via WhatsApp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/256744854500?text=${encodedMessage}`;

            // Also prepare email body
            const mailtoLink = `mailto:tetahills.ac.ug?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`)}`;

            // Show success message
            showFormMessage('Message sent successfully! We will contact you soon.', 'success');

            // Open WhatsApp (commented out - uncomment if you want automatic WhatsApp opening)
            // window.open(whatsappURL, '_blank');

            // Reset form
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                document.getElementById('form-message').style.display = 'none';
            }, 5000);
        });
    }

    // Function to show form messages
    function showFormMessage(message, type) {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.classList.remove('success', 'error');
            formMessage.classList.add(type);
            formMessage.style.display = 'block';
        }
    }

    // ===================================
    // SMOOTH SCROLLING
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and other elements
    document.querySelectorAll('.feature-card, .news-card, .team-member, .facility-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===================================
    // NAVIGATION SCROLL EFFECT
    // ===================================

    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // ===================================
    // QUICK CONTACT BUTTONS
    // ===================================

    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://wa.me/256744854500', '_blank');
        });
    }

    const callBtn = document.querySelector('.call-btn');
    if (callBtn) {
        callBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'tel:+256744854500';
        });
    }

    const emailBtn = document.querySelector('.email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'mailto:tetahills.ac.ug';
        });
    }

    // ===================================
    // ADD RIPPLE EFFECT TO BUTTONS
    // ===================================

    const buttons = document.querySelectorAll('.btn, .quick-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ===================================
    // COUNTER ANIMATION
    // ===================================

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .perf-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const suffix = counter.textContent.replace(/[0-9]/g, '');
            
            if (!isNaN(target)) {
                let current = 0;
                const increment = Math.ceil(target / 50);
                
                const updateCounter = () => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                    } else {
                        counter.textContent = current + suffix;
                        setTimeout(updateCounter, 30);
                    }
                };
                
                updateCounter();
            }
        });
    }

    // Trigger counter animation when stats section is in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // ===================================
    // FORM INPUT VALIDATION
    // ===================================

    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ff6b35';
            } else if (this.type === 'email' && this.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#ff6b35';
                } else {
                    this.style.borderColor = '#00d084';
                }
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    });

    // ===================================
    // RESPONSIVE IMAGES
    // ===================================

    // Add loading lazy loading to images (optional)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });

    // ===================================
    // ACCESSIBILITY - KEYBOARD NAVIGATION
    // ===================================

    document.addEventListener('keydown', function(e) {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ===================================
    // DYNAMIC YEAR IN FOOTER
    // ===================================

    const footerYear = document.querySelector('.footer-bottom');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = `© ${currentYear} Teta Hills Secondary School. All Rights Reserved.`;
    }

    // ===================================
    // PREFETCH LINKS
    // ===================================

    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        link.addEventListener('mouseover', function() {
            const href = this.getAttribute('href');
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = href;
            document.head.appendChild(prefetchLink);
        });
    });

    console.log('Teta Hills School website loaded successfully!');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

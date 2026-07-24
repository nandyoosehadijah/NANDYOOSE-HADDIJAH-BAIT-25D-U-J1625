/* ===========================
   TETA HILLS SECONDARY SCHOOL
   Site Interactivity
   =========================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------
       1. Mobile Hamburger Menu
       --------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close the menu whenever a nav link is tapped
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close the menu when tapping outside of it
        document.addEventListener('click', function (e) {
            const clickedInsideNav = navMenu.contains(e.target) || hamburger.contains(e.target);
            if (!clickedInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    /* ---------------------------
       2. Navbar shadow on scroll
       --------------------------- */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const toggleNavbarShadow = function () {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        toggleNavbarShadow();
        window.addEventListener('scroll', toggleNavbarShadow);
    }

    /* ---------------------------
       3. Scroll-reveal animations
       --------------------------- */
    const revealSelectors = [
        '.feature-card', '.news-card', '.stat-item',
        '.mvv-card', '.team-member', '.achievement-item', '.timeline-item',
        '.facility-card', '.amenity-item', '.access-card', '.tech-item',
        '.curriculum-card', '.method-card', '.dept-card', '.performance-item', '.activity-card',
        '.gallery-item', '.contact-card', '.faq-item', '.dept-contact-card', '.hours-item'
    ];
    const revealEls = document.querySelectorAll(revealSelectors.join(','));

    if (revealEls.length && 'IntersectionObserver' in window) {
        revealEls.forEach(function (el) { el.classList.add('reveal'); });

        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.classList.add('reveal-active');
                    }, (index % 6) * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('reveal', 'reveal-active'); });
    }

    /* ---------------------------
       4. Animated number counters
       (.stat-number, .perf-number)
       --------------------------- */
    const counterEls = document.querySelectorAll('.stat-number, .perf-number');

    function animateCounter(el) {
        const raw = el.textContent.trim();
        const match = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
        if (!match) return; // Skip non-numeric values like "A's & B's"

        const prefix = match[1];
        const target = parseInt(match[2].replace(/,/g, ''), 10);
        const suffix = match[3];
        const duration = 1500;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = prefix + target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(tick);
    }

    if (counterEls.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterEls.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ---------------------------
       5. Back-to-top button
       --------------------------- */
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '↑';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------------------------
       6. Gallery filter + lightbox
       (only runs on gallery.html)
       --------------------------- */
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterButtons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                galleryItems.forEach(function (item) {
                    const category = item.getAttribute('data-category');
                    const show = filter === 'all' || filter === category;
                    item.style.display = show ? '' : 'none';
                    if (show) {
                        item.classList.remove('reveal-active');
                        requestAnimationFrame(function () {
                            item.classList.add('reveal-active');
                        });
                    }
                });
            });
        });

        // Lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML =
            '<button class="lightbox-close" aria-label="Close">&times;</button>' +
            '<button class="lightbox-prev" aria-label="Previous">&#10094;</button>' +
            '<div class="lightbox-content">' +
                '<div class="lightbox-media"></div>' +
                '<p class="lightbox-caption"></p>' +
            '</div>' +
            '<button class="lightbox-next" aria-label="Next">&#10095;</button>';
        document.body.appendChild(lightbox);

        const lightboxMedia = lightbox.querySelector('.lightbox-media');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        let visibleItems = [];
        let currentIndex = 0;

        function getVisibleItems() {
            return Array.prototype.filter.call(galleryItems, function (item) {
                return item.style.display !== 'none';
            });
        }

        function openLightbox(item) {
            visibleItems = getVisibleItems();
            currentIndex = visibleItems.indexOf(item);
            renderLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function renderLightbox() {
            const item = visibleItems[currentIndex];
            if (!item) return;
            const visual = item.querySelector('.gallery-visual');
            const caption = item.querySelector('.gallery-caption h3');
            const desc = item.querySelector('.gallery-caption p');
            lightboxMedia.innerHTML = visual ? visual.outerHTML : '';
            lightboxCaption.innerHTML = (caption ? '<strong>' + caption.textContent + '</strong><br>' : '') +
                (desc ? desc.textContent : '');
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        galleryItems.forEach(function (item) {
            item.addEventListener('click', function () { openLightbox(item); });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % visibleItems.length;
            renderLightbox();
        });
        lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            renderLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
            if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
        });
    }

    /* ---------------------------
       7. FAQ accordion
       (only runs where .faq-item exists)
       --------------------------- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
        item.addEventListener('click', function () {
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                openItem.classList.remove('open');
            });
            if (!wasOpen) item.classList.add('open');
        });
    });

    /* ---------------------------
       8. Contact form validation
       (only runs where .contact-form exists)
       --------------------------- */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const messageBox = contactForm.querySelector('.form-message');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let valid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(function (field) {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#e63946';
                } else {
                    field.style.borderColor = '';
                }
            });

            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    valid = false;
                    emailField.style.borderColor = '#e63946';
                }
            }

            if (messageBox) {
                messageBox.style.display = 'block';
                if (valid) {
                    messageBox.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
                    messageBox.className = 'form-message success';
                    contactForm.reset();
                } else {
                    messageBox.textContent = 'Please fill in all required fields correctly.';
                    messageBox.className = 'form-message error';
                }
            }
        });
    }

});

/**
 * People First Urgent Care - Main JavaScript
 * This file contains all the JavaScript functionality for the redesigned website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeroCarousel();
    initAnimations();
    initAccessibility();
    initExpandableLocationCards();
    initServiceCategoryFilter();
});

/**
 * Mobile Menu Functionality
 * Updated to work with new header system (.mobile-toggle)
 */
function initMobileMenu() {
    // Check if new header system is present
    const newMobileToggle = document.querySelector('.mobile-toggle');
    if (newMobileToggle) {
        // New header system handles mobile menu - skip this function
        return;
    }

    // Legacy mobile menu support (for pages not using new header system)
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    if (overlay) {
        overlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // Handle submenu toggles
    const submenuToggles = document.querySelectorAll('.has-submenu > a');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                this.parentNode.classList.toggle('submenu-open');
            }
        });
    });
}

/**
 * Hero Carousel Functionality
 */
function initHeroCarousel() {
    const heroCarousel = document.querySelector('.hero-carousel');
    if (!heroCarousel) return;

    const slides = heroCarousel.querySelectorAll('.hero-slide');
    const indicators = heroCarousel.querySelectorAll('.hero-indicator');
    const prevBtn = heroCarousel.querySelector('.hero-prev');
    const nextBtn = heroCarousel.querySelector('.hero-next');

    // Accessibility: annotate indicators (if present)
    const indicatorsContainer = heroCarousel.querySelector('.hero-indicators');
    if (indicatorsContainer && indicators.length > 0) {
        indicatorsContainer.setAttribute('role', 'tablist');
        indicatorsContainer.setAttribute('aria-label', 'Hero slides');
        indicators.forEach((btn, i) => {
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');
            if (!btn.hasAttribute('aria-label')) {
                btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
            }
        });
    }

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // Time between auto-slides (6 seconds)

    // Function to go to a specific slide
    function goToSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));

        // Remove active class from indicators (if present)
        if (indicators.length > 0) {
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
                indicator.setAttribute('aria-current', 'false');
            });
        }

        // Add active class to current slide
        slides[index].classList.add('active');

        // Add active class to current indicator (if present)
        if (indicators.length > 0 && indicators[index]) {
            indicators[index].classList.add('active');
            indicators[index].setAttribute('aria-current', 'true');
        }

        // Update current slide index
        currentSlide = index;
    }

    // Function to go to the next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    // Function to go to the previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    // Set up auto-sliding
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Stop auto-sliding (when user interacts with carousel)
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }

    // Restart auto-sliding after user interaction
    function resetSlideInterval() {
        stopSlideInterval();
        startSlideInterval();
    }

    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideInterval();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideInterval();
        });
    }

    // Event listeners for indicators (if present)
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                resetSlideInterval();
            });
        });
    }

    // Start auto-sliding
    startSlideInterval();

    // Pause auto-sliding when user hovers over carousel
    heroCarousel.addEventListener('mouseenter', stopSlideInterval);
    heroCarousel.addEventListener('mouseleave', startSlideInterval);

    // Handle touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroCarousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroCarousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left (next slide)
            nextSlide();
            resetSlideInterval();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right (previous slide)
            prevSlide();
            resetSlideInterval();
        }
    }
}

/**
 * Animation Functionality
 */
function initAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Stop observing after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Accessibility Improvements
 */
function initAccessibility() {
    // Add focus states for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('keyboard-focus');
        });

        element.addEventListener('blur', () => {
            element.classList.remove('keyboard-focus');
        });
    });
}

/**
 * Expandable Location Cards for Mobile
 */
function initExpandableLocationCards() {
    const expandButtons = document.querySelectorAll('.location-expand-btn');

    if (!expandButtons.length) return;

    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.location-card');
            card.classList.toggle('expanded');

            // Accessibility
            const isExpanded = card.classList.contains('expanded');
            this.setAttribute('aria-expanded', isExpanded);

            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                if (isExpanded) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });
}

/**
 * Service Category Filter
 */
function initServiceCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.service-category');
    const serviceCards = document.querySelectorAll('.service-card');

    if (!categoryButtons.length || !serviceCards.length) return;

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get the category to filter by
            const category = this.getAttribute('data-category');

            // Show/hide service cards based on category
            serviceCards.forEach(card => {
                if (category === 'all') {
                    // Show all cards
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = '';
                    }, 50);
                } else {
                    // Check if card has the selected category
                    const cardCategories = card.getAttribute('data-category');

                    if (cardCategories && (cardCategories.includes(category) || cardCategories === category)) {
                        // Show card
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = '';
                        }, 50);
                    } else {
                        // Hide card
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}
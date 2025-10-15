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
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
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

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // Time between auto-slides (6 seconds)

    // Function to go to a specific slide
    function goToSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

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

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetSlideInterval();
        });
    });

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

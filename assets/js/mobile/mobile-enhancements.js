/**
 * People First Urgent Care - Mobile Enhancements
 * Improves mobile experience with touch-friendly interactions and performance optimizations
 * Version: 1.0.0
 */
(function(window, document) {
    'use strict';

    /**
     * Initialize all mobile enhancements
     */
    function initMobileEnhancements() {
        // Check if we're on a mobile device
        const isMobile = window.innerWidth <= 768 || 
                        ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0);
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
            
            // Initialize all mobile-specific enhancements
            optimizeTouchTargets();
            enhanceMobileMenu();
            optimizeLocationCards();
            fixMobileScrolling();
            improveMobilePerformance();
        }
    }

    /**
     * Optimize touch targets for better mobile interaction
     */
    function optimizeTouchTargets() {
        // Ensure all interactive elements have adequate touch targets
        const touchElements = document.querySelectorAll('button, .btn, a.btn, .submenu-toggle, input[type="submit"], .mobile-toggle, .mobile-menu-toggle, .carousel-arrow, .hero-nav-arrow');
        
        touchElements.forEach(element => {
            // Ensure minimum touch target size
            if (element.offsetWidth < 44 || element.offsetHeight < 44) {
                element.style.minWidth = '44px';
                element.style.minHeight = '44px';
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
            }
            
            // Add touch feedback
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }

    /**
     * Enhance mobile menu functionality
     * Updated to work with new header system (.mobile-toggle)
     */
    function enhanceMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-toggle');
        const mainNavigation = document.querySelector('.main-navigation');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

        if (!mobileMenuToggle) return; // New header system handles everything

        // New header system already creates overlay and handles functionality
        // Just add any additional mobile-specific enhancements here if needed

        // The new header system handles all mobile menu functionality
        // This function now just ensures compatibility
        const submenuToggles = document.querySelectorAll('.submenu-toggle, [data-submenu-toggle]');
        submenuToggles.forEach(toggle => {
            // Ensure proper size
            toggle.style.minWidth = '44px';
            toggle.style.minHeight = '44px';
            
            // Fix positioning
            const parentItem = toggle.closest('.menu-item-has-children');
            if (parentItem) {
                const parentLink = parentItem.querySelector('a');
                if (parentLink) {
                    toggle.style.top = `${(parentLink.offsetHeight - toggle.offsetHeight) / 2}px`;
                }
            }
        });
    }

    /**
     * Optimize location cards for mobile
     */
    function optimizeLocationCards() {
        const locationCards = document.querySelectorAll('.location-card');
        
        locationCards.forEach(card => {
            const expandBtn = card.querySelector('.location-expand-btn');
            
            if (expandBtn) {
                // Ensure proper touch target size
                expandBtn.style.minWidth = '44px';
                expandBtn.style.minHeight = '44px';
                
                // Add touch feedback
                expandBtn.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                }, { passive: true });
                
                expandBtn.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                }, { passive: true });
            }
            
            // Make Google Maps embeds responsive
            const iframe = card.querySelector('iframe');
            if (iframe) {
                iframe.style.width = '100%';
                iframe.style.minHeight = '250px';
            }
        });
    }

    /**
     * Fix mobile scrolling issues
     */
    function fixMobileScrolling() {
        // The new header system (header-system-new.js) already handles mobile scrolling
        // This function is kept for compatibility but functionality is handled by the new system

        // Additional mobile scrolling optimizations can be added here if needed
        // The new header system handles body scroll prevention automatically
        
        // Fix iOS momentum scrolling
        const scrollableElements = document.querySelectorAll('.main-navigation, .location-details, .modal-content');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }

    /**
     * Improve mobile performance
     */
    function improveMobilePerformance() {
        // Optimize images for mobile
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        
        // Reduce animation complexity on mobile
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .slide-up, .slide-in-left, .slide-in-right');
        animatedElements.forEach(element => {
            // Remove animations for better performance
            element.classList.add('no-animation');
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    // Run initialization when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initMobileEnhancements);
    
    // Re-run optimizations on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initMobileEnhancements, 250);
    });

})(window, document);

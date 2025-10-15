/**
 * Mobile Optimizations for People First Urgent Care
 * Enhances mobile experience with touch-friendly interactions and performance optimizations
 */
(function(window, document) {
    'use strict';

    /**
     * Lazy Loading Images for Better Mobile Performance
     */
    function initLazyLoading() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src], .lazy-image, [data-background]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // If it's an image with data-src
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // If it's a background image
                        if (img.dataset.background) {
                            img.style.backgroundImage = `url('${img.dataset.background}')`;
                            img.removeAttribute('data-background');
                        }
                        
                        // Add loaded class for fade-in effect
                        img.classList.add('loaded');
                        
                        // Stop observing the image
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '0px 0px 200px 0px' // Load images when they're 200px from viewport
            });
            
            // Observe each lazy image
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const lazyImages = document.querySelectorAll('img[data-src], .lazy-image, [data-background]');
            
            // Load all images immediately
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                if (img.dataset.background) {
                    img.style.backgroundImage = `url('${img.dataset.background}')`;
                    img.removeAttribute('data-background');
                }
                
                img.classList.add('loaded');
            });
        }
    }
    
    /**
     * Detect Touch Devices and Apply Special Handling
     */
    function initTouchDetection() {
        const isTouchDevice = ('ontouchstart' in window) || 
                             (navigator.maxTouchPoints > 0) || 
                             (navigator.msMaxTouchPoints > 0);
        
        // Add touch-device class to body if applicable
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
            
            // Add active state for touch feedback on buttons and links
            const touchElements = document.querySelectorAll('.btn, .card, .location-card, .service-card, .team-member, .gallery-item');
            
            touchElements.forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                }, { passive: true });
                
                element.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                }, { passive: true });
            });
            
            // Optimize submenu behavior for touch
            const parentMenuItems = document.querySelectorAll('.menu-item-has-children > a');
            
            parentMenuItems.forEach(item => {
                item.addEventListener('touchend', function(e) {
                    const parent = this.parentNode;
                    const submenu = parent.querySelector('.sub-menu');
                    const submenuToggle = parent.querySelector('.submenu-toggle');
                    
                    // If submenu is not active, prevent navigation and open submenu
                    if (submenu && !submenu.classList.contains('active')) {
                        e.preventDefault();
                        if (submenuToggle) {
                            submenuToggle.click();
                        }
                    }
                });
            });
        }
    }
    
    /**
     * Optimize Location Cards for Mobile
     */
    function initMobileLocationCards() {
        const locationCards = document.querySelectorAll('.location-card');
        const isMobile = window.innerWidth <= 768;
        
        if (locationCards.length > 0 && isMobile) {
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
            });
        }
    }
    
    /**
     * Initialize all mobile optimizations
     */
    function initMobileOptimizations() {
        initLazyLoading();
        initTouchDetection();
        initMobileLocationCards();
    }
    
    // Run initialization when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initMobileOptimizations);
    
})(window, document);

/**
 * Performance Enhancements for People First Urgent Care
 * Optimizes loading, reduces layout shifts, and improves perceived performance
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // Performance monitoring
    const performanceMetrics = {
        startTime: performance.now(),
        domContentLoaded: null,
        fullyLoaded: null,
        firstPaint: null,
        firstContentfulPaint: null
    };

    /**
     * Initialize performance enhancements
     */
    function initPerformanceEnhancements() {
        // Critical path optimizations
        optimizeCriticalPath();
        
        // Image loading optimizations
        initLazyLoading();
        
        // Font loading optimizations
        optimizeFontLoading();
        
        // CSS loading optimizations
        optimizeCSSLoading();
        
        // Preload critical resources
        preloadCriticalResources();
        
        // Monitor performance metrics
        monitorPerformanceMetrics();
        
        // Reduce layout shifts
        preventLayoutShifts();
        
        // Optimize animations for performance
        optimizeAnimations();
    }

    /**
     * Optimize critical rendering path
     */
    function optimizeCriticalPath() {
        // Inline critical CSS if not already done
        const criticalCSS = document.querySelector('link[href*="critical.css"]');
        if (criticalCSS && !document.querySelector('style[data-critical]')) {
            fetch(criticalCSS.href)
                .then(response => response.text())
                .then(css => {
                    const style = document.createElement('style');
                    style.setAttribute('data-critical', 'true');
                    style.textContent = css;
                    document.head.insertBefore(style, criticalCSS);
                    criticalCSS.remove();
                })
                .catch(() => {
                    // Fallback: keep the link tag
                });
        }

        // Prioritize above-the-fold content
        const aboveFoldElements = document.querySelectorAll('.hero, .page-header, #site-header');
        aboveFoldElements.forEach(element => {
            element.style.willChange = 'auto';
        });
    }

    /**
     * Enhanced lazy loading with intersection observer
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add loading skeleton
                        img.classList.add('skeleton');
                        
                        // Load the image
                        const actualSrc = img.dataset.src || img.src;
                        const tempImg = new Image();
                        
                        tempImg.onload = () => {
                            img.src = actualSrc;
                            img.classList.remove('skeleton');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        };
                        
                        tempImg.onerror = () => {
                            img.classList.remove('skeleton');
                            img.classList.add('error');
                            observer.unobserve(img);
                        };
                        
                        tempImg.src = actualSrc;
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all images
            const images = document.querySelectorAll('img[loading="lazy"], img[data-src]');
            images.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Optimize font loading
     */
    function optimizeFontLoading() {
        // Use font-display: swap for better performance
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            if (!link.href.includes('display=swap')) {
                link.href += link.href.includes('?') ? '&display=swap' : '?display=swap';
            }
        });

        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
        ];

        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
    }

    /**
     * Optimize CSS loading
     */
    function optimizeCSSLoading() {
        // Load non-critical CSS asynchronously
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        nonCriticalCSS.forEach(link => {
            if (!link.href.includes('critical.css') && !link.href.includes('header-system-complete.css')) {
                // Make non-critical CSS load asynchronously
                link.media = 'print';
                link.onload = function() {
                    this.media = 'all';
                };
            }
        });
    }

    /**
     * Preload critical resources
     */
    function preloadCriticalResources() {
        const criticalResources = [
            { href: 'assets/js/header-inline.js', as: 'script' },
            { href: 'assets/js/core/header-system-new.js', as: 'script' },
            { href: 'assets/images/logo_peoplefirst-01.svg', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'script') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }

    /**
     * Monitor performance metrics
     */
    function monitorPerformanceMetrics() {
        // Record DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            performanceMetrics.domContentLoaded = performance.now();
        });

        // Record window load
        window.addEventListener('load', () => {
            performanceMetrics.fullyLoaded = performance.now();
            
            // Get paint metrics
            if ('getEntriesByType' in performance) {
                const paintEntries = performance.getEntriesByType('paint');
                paintEntries.forEach(entry => {
                    if (entry.name === 'first-paint') {
                        performanceMetrics.firstPaint = entry.startTime;
                    } else if (entry.name === 'first-contentful-paint') {
                        performanceMetrics.firstContentfulPaint = entry.startTime;
                    }
                });
            }

            // Log performance metrics (for development)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Performance Metrics:', performanceMetrics);
            }
        });
    }

    /**
     * Prevent layout shifts
     */
    function preventLayoutShifts() {
        // Add aspect ratio containers for images
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            if (!img.closest('.aspect-ratio-container')) {
                const container = document.createElement('div');
                container.className = 'aspect-ratio-container';
                container.style.cssText = `
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-bottom: 56.25%; /* 16:9 aspect ratio */
                    overflow: hidden;
                `;
                
                img.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
                
                img.parentNode.insertBefore(container, img);
                container.appendChild(img);
            }
        });

        // Reserve space for dynamic content
        const dynamicContainers = document.querySelectorAll('[data-dynamic-height]');
        dynamicContainers.forEach(container => {
            const minHeight = container.dataset.dynamicHeight;
            container.style.minHeight = minHeight;
        });
    }

    /**
     * Optimize animations for performance
     */
    function optimizeAnimations() {
        // Use will-change property for animated elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right, .hover-lift');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            
            // Remove will-change after animation completes
            element.addEventListener('animationend', () => {
                element.style.willChange = 'auto';
            }, { once: true });
        });

        // Reduce animations on low-end devices
        if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
            document.body.classList.add('reduce-animations');
        }

        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-animations');
        }
    }

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformanceEnhancements);
    } else {
        initPerformanceEnhancements();
    }

    // Export for debugging
    window.performanceMetrics = performanceMetrics;

})();

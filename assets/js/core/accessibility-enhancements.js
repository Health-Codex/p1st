/**
 * Accessibility Enhancements for People First Urgent Care
 * Improves WCAG compliance and user experience for all users
 * Version: 1.0.0
 */

(function() {
    'use strict';

    /**
     * Initialize accessibility enhancements
     */
    function initAccessibilityEnhancements() {
        // Skip links for keyboard navigation
        addSkipLinks();
        
        // Enhanced focus management
        enhanceFocusManagement();
        
        // ARIA enhancements
        enhanceARIA();
        
        // Keyboard navigation improvements
        improveKeyboardNavigation();
        
        // Screen reader optimizations
        optimizeScreenReader();
        
        // Color contrast improvements
        enhanceColorContrast();
        
        // Motion and animation controls
        handleMotionPreferences();
        
        // Form accessibility
        enhanceFormAccessibility();
        
        // Live region announcements
        setupLiveRegions();
    }

    /**
     * Add skip links for keyboard navigation
     */
    function addSkipLinks() {
        if (document.querySelector('.skip-links')) return;

        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#site-header" class="skip-link">Skip to navigation</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;

        // Add styles for skip links
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -100px;
                left: 0;
                z-index: 10000;
            }
            .skip-link {
                position: absolute;
                top: 0;
                left: 0;
                background: var(--primary-green, #05A65C);
                color: white;
                padding: 0.5rem 1rem;
                text-decoration: none;
                font-weight: 600;
                border-radius: 0 0 4px 0;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            .skip-link:focus {
                transform: translateY(0);
                outline: 2px solid white;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    /**
     * Enhance focus management
     */
    function enhanceFocusManagement() {
        // Improve focus visibility
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid var(--primary-green, #05A65C) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 4px rgba(5, 166, 92, 0.2) !important;
            }
            
            .focus-trap {
                position: relative;
            }
            
            .focus-visible {
                outline: 2px solid var(--primary-green, #05A65C);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.active, .mobile-menu.active');
                if (modal) {
                    trapFocus(e, modal);
                }
            }
        });
    }

    /**
     * Trap focus within a container
     */
    function trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Enhance ARIA attributes
     */
    function enhanceARIA() {
        // Add landmarks
        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        const nav = document.querySelector('nav, .nav-menu');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        // Enhance buttons
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (!text && !button.getAttribute('aria-label')) {
                const icon = button.querySelector('i[class*="fa-"]');
                if (icon) {
                    const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
                    const label = iconClass ? iconClass.replace('fa-', '').replace('-', ' ') : 'Button';
                    button.setAttribute('aria-label', label);
                }
            }
        });

        // Enhance form controls
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const placeholder = input.getAttribute('placeholder');
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                }
            }
        });

        // Enhance headings hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let currentLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > currentLevel + 1) {
                console.warn(`Heading level jump detected: ${heading.tagName} after h${currentLevel}`);
            }
            currentLevel = level;
        });
    }

    /**
     * Improve keyboard navigation
     */
    function improveKeyboardNavigation() {
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu
                const mobileMenu = document.querySelector('.mobile-menu.active');
                if (mobileMenu) {
                    const closeButton = mobileMenu.querySelector('.mobile-menu-close');
                    if (closeButton) closeButton.click();
                }

                // Close modals
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    const closeButton = modal.querySelector('.modal-close');
                    if (closeButton) closeButton.click();
                }
            }
        });

        // Arrow key navigation for menus
        const menuItems = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextItem = menuItems[index + 1] || menuItems[0];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                    prevItem.focus();
                }
            });
        });
    }

    /**
     * Optimize for screen readers
     */
    function optimizeScreenReader() {
        // Add screen reader only text for context
        const srOnlyStyle = `
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = srOnlyStyle;
        document.head.appendChild(style);

        // Add context for links
        const links = document.querySelectorAll('a[href]:not([aria-label]):not([aria-labelledby])');
        links.forEach(link => {
            const text = link.textContent.trim();
            if (text === 'Read more' || text === 'Learn more' || text === 'Click here') {
                const context = link.closest('article, section, .card');
                if (context) {
                    const heading = context.querySelector('h1, h2, h3, h4, h5, h6');
                    if (heading) {
                        const srText = document.createElement('span');
                        srText.className = 'sr-only';
                        srText.textContent = ` about ${heading.textContent}`;
                        link.appendChild(srText);
                    }
                }
            }
        });

        // Announce dynamic content changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const liveRegion = document.querySelector('[aria-live]');
                    if (liveRegion && mutation.target.contains(liveRegion)) {
                        // Content was added to a live region
                        const newContent = Array.from(mutation.addedNodes)
                            .filter(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
                            .map(node => node.textContent)
                            .join(' ');
                        
                        if (newContent.trim()) {
                            announceToScreenReader(newContent);
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Enhance color contrast
     */
    function enhanceColorContrast() {
        // Check for high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
            
            const highContrastStyles = `
                .high-contrast {
                    --primary-green: #000000;
                    --medium-gray: #000000;
                    --light-gray: #ffffff;
                }
                .high-contrast a {
                    text-decoration: underline;
                }
                .high-contrast button {
                    border: 2px solid currentColor;
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = highContrastStyles;
            document.head.appendChild(style);
        }
    }

    /**
     * Handle motion preferences
     */
    function handleMotionPreferences() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
            
            const reducedMotionStyles = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = reducedMotionStyles;
            document.head.appendChild(style);
        }
    }

    /**
     * Enhance form accessibility
     */
    function enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add form validation announcements
            form.addEventListener('submit', (e) => {
                const invalidFields = form.querySelectorAll(':invalid');
                if (invalidFields.length > 0) {
                    e.preventDefault();
                    const firstInvalid = invalidFields[0];
                    firstInvalid.focus();
                    announceToScreenReader(`Form has ${invalidFields.length} error${invalidFields.length > 1 ? 's' : ''}. Please correct and try again.`);
                }
            });

            // Add required field indicators
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.getAttribute('aria-required')) {
                    field.setAttribute('aria-required', 'true');
                }
                
                const label = form.querySelector(`label[for="${field.id}"]`);
                if (label && !label.textContent.includes('*')) {
                    label.innerHTML += ' <span aria-label="required">*</span>';
                }
            });
        });
    }

    /**
     * Setup live regions for announcements
     */
    function setupLiveRegions() {
        if (!document.querySelector('#aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }

    /**
     * Announce message to screen readers
     */
    function announceToScreenReader(message) {
        const liveRegion = document.querySelector('#aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibilityEnhancements);
    } else {
        initAccessibilityEnhancements();
    }

    // Export for external use
    window.announceToScreenReader = announceToScreenReader;

})();

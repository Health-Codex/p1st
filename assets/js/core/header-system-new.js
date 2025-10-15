/*
People First Urgent Care - Enhanced Header System
Modern, efficient header functionality with improved mobile menu and navigation
*/

class HeaderSystem {
    constructor() {
        this.header = null;
        this.mobileToggle = null;
        this.mobileMenu = null;
        this.mobileOverlay = null;
        this.mobileClose = null;
        this.dropdownToggles = [];
        this.isScrolled = false;
        this.isMobileMenuOpen = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.cacheElements();
        this.bindEvents();
        this.setActiveNavItem();
        this.handleScrollState();
        
        console.log('Enhanced Header System initialized');
    }

    cacheElements() {
        this.header = document.getElementById('site-header');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileOverlay = document.getElementById('mobile-menu-overlay');
        this.mobileClose = document.querySelector('.mobile-menu-close');
        this.dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    }

    bindEvents() {
        // Scroll handling
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // Mobile menu events
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }

        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Mobile dropdown toggles
        this.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileDropdown(toggle);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.throttle(() => {
            if (window.innerWidth > 1024 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));

        // Focus trap for mobile menu
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('keydown', (e) => {
                this.handleFocusTrap(e);
            });
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeScrolled = scrollTop > 50;

        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.updateScrollState();
        }
    }

    updateScrollState() {
        if (this.header) {
            this.header.classList.toggle('scrolled', this.isScrolled);
        }
    }

    handleScrollState() {
        // Set initial scroll state
        this.handleScroll();
    }

    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMobileMenuOpen = true;
        
        if (this.mobileMenu) {
            this.mobileMenu.classList.add('active');
        }
        
        if (this.mobileOverlay) {
            this.mobileOverlay.classList.add('active');
        }
        
        if (this.mobileToggle) {
            this.mobileToggle.classList.add('active');
            this.mobileToggle.setAttribute('aria-expanded', 'true');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            if (this.mobileClose) {
                this.mobileClose.focus();
            }
        }, 300);

        console.log('Mobile menu opened');
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        
        if (this.mobileMenu) {
            this.mobileMenu.classList.remove('active');
        }
        
        if (this.mobileOverlay) {
            this.mobileOverlay.classList.remove('active');
        }
        
        if (this.mobileToggle) {
            this.mobileToggle.classList.remove('active');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
        }

        // Restore body scroll
        document.body.style.overflow = '';
        
        // Close all mobile dropdowns
        this.closeAllMobileDropdowns();

        console.log('Mobile menu closed');
    }

    toggleMobileDropdown(toggle) {
        const dropdown = toggle.parentElement.nextElementSibling;
        const isActive = dropdown && dropdown.classList.contains('active');
        
        // Close all other dropdowns
        this.closeAllMobileDropdowns();
        
        if (!isActive && dropdown) {
            dropdown.classList.add('active');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
        }
    }

    closeAllMobileDropdowns() {
        const activeDropdowns = document.querySelectorAll('.mobile-dropdown.active');
        const activeToggles = document.querySelectorAll('.mobile-dropdown-toggle.active');
        
        activeDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        activeToggles.forEach(toggle => {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    }

    setActiveNavItem() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        // Map filenames to page identifiers
        const pageMap = {
            'index': 'home',
            '': 'home',
            'about': 'about',
            'our-staff': 'staff',
            'patient-services': 'services',
            'lab-testing': 'services',
            'x-ray': 'services',
            'vaccinations': 'services',
            'physicals': 'services',
            'urgent-care': 'services',
            'primary-care': 'services',
            'telemedicine': 'telemedicine',
            'insurance': 'insurance',
            'contact': 'locations',
            'gallery': 'gallery'
        };
        
        return pageMap[filename] || filename;
    }

    handleFocusTrap(e) {
        if (e.key !== 'Tab') return;
        
        const focusableElements = this.mobileMenu.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Public API methods
    refresh() {
        this.setActiveNavItem();
        this.handleScrollState();
    }

    destroy() {
        // Clean up event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Reset mobile menu state
        this.closeMobileMenu();
        document.body.style.overflow = '';
        
        console.log('Header System destroyed');
    }
}

// Initialize header system
let headerSystemInstance = null;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        headerSystemInstance = new HeaderSystem();
        // Expose the live instance globally after creation
        window.headerSystem = headerSystemInstance;
    });
} else {
    headerSystemInstance = new HeaderSystem();
    // Expose the live instance globally immediately
    window.headerSystem = headerSystemInstance;
}

// Export for global access
window.HeaderSystem = HeaderSystem;

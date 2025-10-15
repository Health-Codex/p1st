/**
 * CENTRALIZED HEADER SYSTEM for People First Urgent Care
 *
 * ⚡ SINGLE SOURCE OF TRUTH for all header/navigation changes
 * 🔄 Changes here automatically apply to ALL pages site-wide
 * 📱 Complete mobile navigation system with hamburger menu
 * 🌐 Works with file:// protocol (no web server required)
 * ♿ Fully accessible with ARIA labels and keyboard navigation
 *
 * MAINTENANCE: To update navigation links, edit the HEADER_HTML template below
 * TESTING: Use mobile-nav-test.html to verify changes
 * DOCUMENTATION: See MOBILE_NAVIGATION_SYSTEM_DOCUMENTATION.md
 */

// Header HTML template - centralized source of truth
const HEADER_HTML = `
<!-- Skip to content link for accessibility -->
<a href="#main-content" class="skip-to-content">Skip to content</a>

<!-- Site Header -->
<header class="site-header" id="site-header">
    <!-- Main Header -->
    <div class="main-header">
        <div class="header-container">
            <!-- Logo -->
            <div class="logo">
                <a href="index.html" aria-label="People First Urgent Care - Home">
                    <img src="assets/images/logo_peoplefirst-01.svg"
                         alt="People First Urgent Care"
                         width="auto"
                         height="50">
                </a>
            </div>

            <!-- Navigation Menu -->
            <div class="nav-container">
                <nav class="main-navigation" role="navigation" aria-label="Main Navigation">
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a href="index.html" class="nav-link">Home</a>
                        </li>
                        <li class="nav-item">
                            <a href="about.html" class="nav-link">About Us</a>
                        </li>
                        <li class="nav-item">
                            <a href="our-staff.html" class="nav-link">Our Staff</a>
                        </li>
                        <li class="nav-item has-dropdown">
                            <a href="patient-services.html" class="nav-link">
                                Patient Services
                                <i class="fa-solid fa-chevron-down dropdown-icon"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="lab-testing.html" class="dropdown-item">Laboratory Testing</a>
                                <a href="x-ray.html" class="dropdown-item">X-Ray & Imaging</a>
                                <a href="vaccinations.html" class="dropdown-item">Vaccinations</a>
                                <a href="physicals.html" class="dropdown-item">Physicals</a>
                                <a href="urgent-care.html" class="dropdown-item">Urgent Care</a>
                                <a href="primary-care.html" class="dropdown-item">Primary Care</a>
                                <a href="telemedicine.html" class="dropdown-item">Telemedicine</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a href="telemedicine.html" class="nav-link">Telemedicine</a>
                        </li>
                        <li class="nav-item">
                            <a href="insurance.html" class="nav-link">Insurance</a>
                        </li>
                        <li class="nav-item has-dropdown">
                            <a href="contact.html" class="nav-link">
                                Locations
                                <i class="fa-solid fa-chevron-down dropdown-icon"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="contact.html" class="dropdown-item">All Locations</a>
                                <a href="contact.html#collierville" class="dropdown-item">Collierville</a>
                                <a href="contact.html#southaven" class="dropdown-item">Southaven</a>
                                <a href="contact.html#germantown" class="dropdown-item">Germantown</a>
                                <a href="contact.html#olive-branch" class="dropdown-item">Olive Branch</a>
                                <a href="contact.html#bartlett" class="dropdown-item">Bartlett</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a href="gallery.html" class="nav-link">Gallery</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- Save Your Spot Button and Pay Now Button -->
            <div class="header-save-spot">
                <a href="save-your-spot.html" class="btn btn-primary header-btn btn-save-spot">
                    <i class="fa-solid fa-calendar-check"></i>
                    Save Your Spot
                </a>
                <a href="payment.html" class="btn btn-secondary header-btn btn-pay-now">
                    <i class="fa-solid fa-credit-card"></i>
                    Pay Now
                </a>
            </div>

            <!-- Mobile Toggle -->
            <button class="mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </div>
</header>

<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>

<!-- Mobile Menu -->
<nav class="mobile-menu" id="mobile-menu" aria-label="Mobile Navigation">
    <!-- Mobile Menu Header -->
    <div class="mobile-menu-header">
        <div class="mobile-menu-logo">
            <img src="assets/images/logo_peoplefirst-01.svg"
                 alt="People First Urgent Care"
                 width="auto"
                 height="40">
        </div>
        <button class="mobile-menu-close" aria-label="Close navigation menu">
            <i class="fa-solid fa-times"></i>
        </button>
    </div>

    <!-- Mobile Navigation Menu -->
    <ul class="mobile-nav-menu">
        <li class="mobile-nav-item">
            <a href="index.html" class="mobile-nav-link" data-page="home">Home</a>
        </li>
        <li class="mobile-nav-item">
            <a href="about.html" class="mobile-nav-link" data-page="about">About Us</a>
        </li>
        <li class="mobile-nav-item">
            <a href="our-staff.html" class="mobile-nav-link" data-page="staff">Our Staff</a>
        </li>
        <li class="mobile-nav-item">
            <a href="patient-services.html" class="mobile-nav-link" data-page="services">
                Patient Services
                <button class="mobile-dropdown-toggle" aria-label="Toggle Patient Services menu">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
            </a>
            <div class="mobile-dropdown">
                <a href="lab-testing.html" class="mobile-dropdown-item">Laboratory Testing</a>
                <a href="x-ray.html" class="mobile-dropdown-item">X-Ray & Imaging</a>
                <a href="vaccinations.html" class="mobile-dropdown-item">Vaccinations</a>
                <a href="physicals.html" class="mobile-dropdown-item">Physicals</a>
                <a href="urgent-care.html" class="mobile-dropdown-item">Urgent Care</a>
                <a href="primary-care.html" class="mobile-dropdown-item">Primary Care</a>
                <a href="telemedicine.html" class="mobile-dropdown-item">Telemedicine</a>
            </div>
        </li>
        <li class="mobile-nav-item">
            <a href="telemedicine.html" class="mobile-nav-link" data-page="telemedicine">Telemedicine</a>
        </li>
        <li class="mobile-nav-item">
            <a href="insurance.html" class="mobile-nav-link" data-page="insurance">Insurance</a>
        </li>
        <li class="mobile-nav-item">
            <a href="contact.html" class="mobile-nav-link" data-page="locations">
                Locations
                <button class="mobile-dropdown-toggle" aria-label="Toggle Locations menu">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
            </a>
            <div class="mobile-dropdown">
                <a href="contact.html" class="mobile-dropdown-item">All Locations</a>
                <a href="contact.html#collierville" class="mobile-dropdown-item">Collierville</a>
                <a href="contact.html#southaven" class="mobile-dropdown-item">Southaven</a>
                <a href="contact.html#germantown" class="mobile-dropdown-item">Germantown</a>
                <a href="contact.html#olive-branch" class="mobile-dropdown-item">Olive Branch</a>
                <a href="contact.html#bartlett" class="mobile-dropdown-item">Bartlett</a>
            </div>
        </li>
        <li class="mobile-nav-item">
            <a href="gallery.html" class="mobile-nav-link" data-page="gallery">Gallery</a>
        </li>
    </ul>
</nav>
`;

/**
 * Inject header HTML into the page
 * This function works with file:// protocol and doesn't require fetch
 */
function injectHeader() {
    // Find all elements with data-include="header"
    const headerPlaceholders = document.querySelectorAll('[data-include="header"]');
    
    headerPlaceholders.forEach(placeholder => {
        placeholder.innerHTML = HEADER_HTML;
    });
    
    console.log('Header injected successfully via inline system');
}

/**
 * Initialize the header system when DOM is ready
 * Works with both file:// and http:// protocols
 */
function initializeHeaderSystem() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
}

// Auto-initialize when script loads
initializeHeaderSystem();

// Ensure site-wide search script is available once per page
(function ensureSiteSearch(){
    try {
        if (document.getElementById('site-search-script')) return;
        const s = document.createElement('script');
        s.id = 'site-search-script';
        s.src = 'assets/js/features/site-search.js';
        s.defer = true;
        document.head.appendChild(s);
    } catch (_) {}
})();

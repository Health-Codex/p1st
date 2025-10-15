/**
 * File-Compatible Footer System for People First Urgent Care
 * Mirrors the header inline system using data-include="footer"
 * Works with file:// and http(s) without fetch or server includes
 */

// Footer HTML template factory (includes dynamic year)
function getFooterHTML() {
  const year = new Date().getFullYear();
  return `
<!-- Footer -->
<footer class="site-footer footer-compact">
  <div class="footer-top">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-info stagger-item">
          <div class="footer-logo">
            <img src="assets/images/logo_peoplefirst-01.svg" alt="People First Urgent Care" width="180" height="auto">
          </div>
          <h3 class="gradient-text">About Us</h3>
          <p>People First Urgent Care provides high-quality, affordable healthcare services for the whole family. Our experienced medical team is dedicated to your health and well-being.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/PeopleFirstUrgentPrimaryCare/" class="social-link hover-lift" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link hover-lift" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i class="fa-brands fa-twitter"></i>
            </a>
            <a href="#" class="social-link hover-lift" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="social-link hover-lift" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div class="footer-services stagger-item" data-delay="0.2">
          <h3 class="gradient-text">Our Services</h3>
          <ul class="footer-menu">
            <li><a href="lab-testing.html" class="footer-link hover-lift"><i class="fa-solid fa-chevron-right"></i> Lab Testing</a></li>
            <li><a href="x-ray.html" class="footer-link hover-lift"><i class="fa-solid fa-chevron-right"></i> X-Ray & Imaging</a></li>
            <li><a href="vaccinations.html" class="footer-link hover-lift"><i class="fa-solid fa-chevron-right"></i> Vaccinations</a></li>
            <li><a href="physicals.html" class="footer-link hover-lift"><i class="fa-solid fa-chevron-right"></i> Physicals</a></li>
            <li><a href="weight-loss.html" class="footer-link hover-lift"><i class="fa-solid fa-chevron-right"></i> Weight Loss</a></li>
            <li><a href="allergy-testing.html" class="footer-link hover-lift"><i class="fa-solid fa-chevron-right"></i> Allergy Testing</a></li>
          </ul>
        </div>
        <div class="footer-contact stagger-item" data-delay="0.3">
          <a href="contact-numbers.html" class="btn btn-gradient btn-compact hover-lift footer-contact-cta" aria-label="View all clinic phone numbers on the contact page"><i class="fa-solid fa-phone"></i> Contact Us</a>
        </div>
      </div>

    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <p>&copy; ${year} People First Urgent Care. All Rights Reserved.</p>
      <div class="footer-bottom-links">
        <a href="privacy-policy.html" class="hover-lift">Privacy Policy</a>
        <a href="terms-of-service.html" class="hover-lift">Terms of Service</a>
        <a href="sitemap.xml" class="hover-lift">Sitemap</a>
        <a href="accessibility.html" class="hover-lift">Accessibility</a>
      </div>
    </div>
  </div>
</footer>`;
}

// Inject footer HTML into the page
function injectFooter() {
  const placeholders = document.querySelectorAll('[data-include="footer"]');
  placeholders.forEach((el) => {
    el.innerHTML = getFooterHTML();
    // Ensure footer items are visible without relying on site-wide animation scripts
    const staggerItems = el.querySelectorAll('.stagger-item');
    staggerItems.forEach((item) => item.classList.add('active'));
  });
  if (placeholders.length) {
    console.log('Footer injected successfully via inline system');
  }
}

// Initialize on DOM ready
function initializeFooterSystem() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
}

initializeFooterSystem();

/**
 * CTA Banner Enhancements
 */
document.addEventListener('DOMContentLoaded', function() {
    initCtaAnimations();
});

function initCtaAnimations() {
    // Add scroll animation to CTA banner
    const ctaBanner = document.querySelector('.cta-banner');
    if (!ctaBanner) return;
    
    // Use Intersection Observer to trigger animation when CTA is in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    observer.observe(ctaBanner);
    
    // Add hover effect to button
    const ctaButton = ctaBanner.querySelector('.btn');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    }
}

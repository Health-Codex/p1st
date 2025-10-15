/**
 * People First Urgent Care - Back to Top Button
 * Adds a back to top button that appears when scrolling down
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initBackToTop();
    });

    /**
     * Initialize back to top button
     */
    function initBackToTop() {
        // Check if back to top button already exists
        let backToTopButton = document.getElementById('back-to-top');
        
        // Create button if it doesn't exist
        if (!backToTopButton) {
            backToTopButton = document.createElement('a');
            backToTopButton.id = 'back-to-top';
            backToTopButton.href = '#top';
            backToTopButton.setAttribute('aria-label', 'Back to top');
            backToTopButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
            document.body.appendChild(backToTopButton);
        }

        // Show button when scrolling down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();

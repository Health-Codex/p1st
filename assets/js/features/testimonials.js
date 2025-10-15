/**
 * People First Urgent Care - Testimonials JavaScript
 * Premium Testimonials Page Functionality
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize testimonials components
        initTestimonialsFilter();
        initVideoPlayers();
        initTestimonialsAnimations();
    });

    /**
     * Testimonials Filter
     */
    function initTestimonialsFilter() {
        const filterButtons = document.querySelectorAll('.testimonials-filter .filter-btn');
        const testimonialCards = document.querySelectorAll('.testimonials-grid .testimonial-card');

        if (filterButtons.length && testimonialCards.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');

                    // Update active button
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Filter testimonials
                    testimonialCards.forEach(card => {
                        const category = card.getAttribute('data-category');

                        if (filter === 'all' || category === filter) {
                            // Show card with animation
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            // Hide card with animation
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });

            // Initialize testimonial cards with transition properties
            testimonialCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    }

    /**
     * Video Players
     */
    function initVideoPlayers() {
        const playButtons = document.querySelectorAll('.play-button');
        
        if (playButtons.length) {
            playButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const videoContainer = this.closest('.video-container');
                    const thumbnail = videoContainer.querySelector('.video-thumbnail');
                    
                    // In a real implementation, this would create an iframe with the video
                    // For this demo, we'll just show an alert
                    alert('Video player would open here in a real implementation.');
                    
                    // Example of how to replace the thumbnail with a video:
                    /*
                    const videoId = 'YOUR_VIDEO_ID'; // e.g., YouTube video ID
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    iframe.width = '100%';
                    iframe.height = '100%';
                    iframe.frameBorder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;
                    
                    // Replace thumbnail with iframe
                    videoContainer.innerHTML = '';
                    videoContainer.appendChild(iframe);
                    */
                });
            });
        }
    }

    /**
     * Testimonials Animations
     */
    function initTestimonialsAnimations() {
        // Add entrance animations to testimonial elements
        const animateElements = [
            { selector: '.testimonials-intro', delay: 0 },
            { selector: '.rating-summary', delay: 200 },
            { selector: '.testimonial-card.featured', delay: 400, stagger: 100 },
            { selector: '.testimonials-filter', delay: 600 },
            { selector: '.testimonials-grid .testimonial-card', delay: 800, stagger: 100 },
            { selector: '.video-testimonial', delay: 1000, stagger: 100 },
            { selector: '.share-story', delay: 1200 }
        ];
        
        animateElements.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            
            elements.forEach((element, index) => {
                // Add animation classes if not already present
                if (!element.classList.contains('animate-on-scroll')) {
                    element.classList.add('animate-on-scroll');
                    element.classList.add('fade-up');
                }
                
                // Add staggered delay
                const staggerDelay = item.stagger ? (item.delay + (index * item.stagger)) : item.delay;
                element.style.animationDelay = `${staggerDelay}ms`;
            });
        });
        
        // Add hover effects to cards
        const hoverElements = document.querySelectorAll('.testimonial-card, .video-testimonial');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.classList.add('hover-active');
            });
            
            element.addEventListener('mouseleave', function() {
                this.classList.remove('hover-active');
            });
        });
        
        // Add scroll animations for rating numbers
        const ratingNumber = document.querySelector('.rating-number');
        if (ratingNumber) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = parseFloat(entry.target.textContent);
                        let current = 0;
                        const increment = target / 40; // Animate over 40 frames
                        
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                entry.target.textContent = current.toFixed(1);
                                requestAnimationFrame(updateCounter);
                            } else {
                                entry.target.textContent = target.toFixed(1);
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            observer.observe(ratingNumber);
        }
    }
})();

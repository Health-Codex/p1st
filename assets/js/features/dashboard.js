/**
 * People First Urgent Care - Dashboard JavaScript
 * Premium Healthcare Dashboard Functionality
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize dashboard components
        initDashboardTabs();
        initAppointmentsFilter();
        initTabLinks();
        initDashboardAnimations();
    });

    /**
     * Dashboard Tabs Navigation
     */
    function initDashboardTabs() {
        const tabLinks = document.querySelectorAll('.dashboard-nav a');
        const tabContents = document.querySelectorAll('.dashboard-tab');

        if (tabLinks.length && tabContents.length) {
            // Handle tab click
            tabLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();

                    const targetTab = this.getAttribute('data-tab');

                    // Update active tab link
                    tabLinks.forEach(link => {
                        link.parentElement.classList.remove('active');
                    });
                    this.parentElement.classList.add('active');

                    // Show target tab content
                    tabContents.forEach(tab => {
                        tab.classList.remove('active');
                    });
                    document.getElementById(targetTab).classList.add('active');

                    // Update URL hash without scrolling
                    history.pushState(null, null, `#${targetTab}`);
                });
            });

            // Check for hash in URL on page load
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                const targetLink = document.querySelector(`.dashboard-nav a[data-tab="${hash}"]`);
                
                if (targetLink) {
                    targetLink.click();
                }
            }
        }
    }

    /**
     * Appointments Filter
     */
    function initAppointmentsFilter() {
        const filterButtons = document.querySelectorAll('.appointments-filter .filter-btn');
        
        if (filterButtons.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active button
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // In a real application, this would filter appointment data
                    const filter = this.getAttribute('data-filter');
                    console.log(`Filtering appointments by: ${filter}`);
                    
                    // For demo purposes, we'll just show the empty state
                    // In a real app, you would filter and display appointments here
                });
            });
        }
    }

    /**
     * Tab Links within Dashboard
     */
    function initTabLinks() {
        const tabLinks = document.querySelectorAll('[data-tab-link]');
        
        if (tabLinks.length) {
            tabLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetTab = this.getAttribute('data-tab-link');
                    const targetLink = document.querySelector(`.dashboard-nav a[data-tab="${targetTab}"]`);
                    
                    if (targetLink) {
                        targetLink.click();
                    }
                });
            });
        }
    }

    /**
     * Dashboard Animations
     */
    function initDashboardAnimations() {
        // Add entrance animations to dashboard elements
        const animateElements = [
            { selector: '.dashboard-welcome', delay: 0 },
            { selector: '.dashboard-sidebar', delay: 200 },
            { selector: '.dashboard-content', delay: 400 },
            { selector: '.stat-card', delay: 600, stagger: 100 },
            { selector: '.reminder-card', delay: 800, stagger: 100 },
            { selector: '.resource-card', delay: 1000, stagger: 100 }
        ];
        
        animateElements.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            
            elements.forEach((element, index) => {
                // Add animation classes
                element.classList.add('animate-on-scroll');
                element.classList.add('fade-up');
                
                // Add staggered delay
                const staggerDelay = item.stagger ? (item.delay + (index * item.stagger)) : item.delay;
                element.style.animationDelay = `${staggerDelay}ms`;
            });
        });
        
        // Add hover effects to cards
        const hoverElements = document.querySelectorAll('.stat-card, .reminder-card, .resource-card');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.classList.add('hover-active');
            });
            
            element.addEventListener('mouseleave', function() {
                this.classList.remove('hover-active');
            });
        });
    }
})();

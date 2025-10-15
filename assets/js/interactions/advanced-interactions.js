/*
People First Urgent Care - Advanced Interactions
Version: 1.0.0
Description: Modern, professional interactive features for all pages
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all advanced interactions
    initScrollAnimations();
    initParallaxEffects();
    initSmoothScrolling();
    initFancyDropdowns();
    initImageEffects();
    initAdvancedForms();
    initAccordionEnhancements();
    initTabsEnhancements();
    initTooltips();
    initCounters();
    initMasonryLayout();
});

// Scroll-triggered animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stagger-item, .fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Parallax scrolling effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (!parallaxElements.length) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.2;
            const offset = scrollY * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (!anchorLinks.length) return;
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced dropdown menus
function initFancyDropdowns() {
    const dropdownToggles = document.querySelectorAll('.submenu-toggle');
    
    if (!dropdownToggles.length) return;
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            
            const parent = this.closest('.menu-item-has-children');
            const submenu = parent.querySelector('.sub-menu');
            
            if (expanded) {
                submenu.style.maxHeight = '0';
                setTimeout(() => {
                    submenu.classList.remove('active');
                }, 300);
            } else {
                submenu.classList.add('active');
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
            
            // Add animation to the icon
            this.querySelector('i').style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });
}

// Advanced image effects
function initImageEffects() {
    // Lazy loading with fade-in effect
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (lazyImages.length) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Image zoom effect on hover
    const zoomImages = document.querySelectorAll('.image-zoom');
    
    if (zoomImages.length) {
        zoomImages.forEach(img => {
            const container = img.closest('.image-zoom-container');
            if (container) {
                container.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.1)';
                });
                
                container.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            }
        });
    }
}

// Enhanced form interactions
function initAdvancedForms() {
    const formInputs = document.querySelectorAll('.form-control');
    
    if (!formInputs.length) return;
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input already has value (e.g., on page reload)
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Enhanced accordion functionality
function initAccordionEnhancements() {
    const accordionItems = document.querySelectorAll('.faq-item');
    
    if (!accordionItems.length) return;
    
    accordionItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-icon i').className = 'fa-solid fa-plus';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                icon.className = 'fa-solid fa-plus';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.className = 'fa-solid fa-minus';
            }
        });
    });
}

// Enhanced tabs functionality
function initTabsEnhancements() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    if (!tabContainers.length) return;
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to current tab and content
                tab.classList.add('active');
                tabContents[index].classList.add('active');
            });
        });
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    if (!tooltipElements.length) return;
    
    tooltipElements.forEach(element => {
        const tooltipText = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', () => {
            tooltip.classList.add('active');
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (!counters.length) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = Math.floor(duration / target);
                
                const timer = setInterval(() => {
                    count++;
                    counter.textContent = count;
                    
                    if (count >= target) {
                        clearInterval(timer);
                    }
                }, interval);
                
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Masonry layout for gallery
function initMasonryLayout() {
    const masonryGrids = document.querySelectorAll('.masonry-grid');
    
    if (!masonryGrids.length) return;
    
    // Simple masonry layout implementation
    masonryGrids.forEach(grid => {
        const items = grid.querySelectorAll('.masonry-item');
        const columns = parseInt(grid.dataset.columns) || 3;
        
        // Set the grid template columns
        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        // Adjust item heights for visual interest
        items.forEach((item, index) => {
            if (index % 3 === 0) {
                item.style.gridRow = 'span 2';
            }
        });
    });
}

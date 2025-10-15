/**
 * People First Urgent Care - Splash Screen
 * Modern welcome modal with interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    initSplashScreen();
});

/**
 * Initialize the splash screen functionality
 */
function initSplashScreen() {
    // Create splash screen if it doesn't exist
    if (!document.querySelector('.splash-screen')) {
        createSplashScreen();
    }

    // Check if user has visited before
    let hasVisited = false;

    try {
        hasVisited = localStorage.getItem('pfuc_has_visited');
    } catch (error) {
        console.warn('Could not access localStorage:', error);
    }

    // Show splash screen if first visit
    if (!hasVisited) {
        showSplashScreen();
    }
}

/**
 * Create the splash screen HTML structure
 */
function createSplashScreen() {
    const splashScreen = document.createElement('div');
    splashScreen.className = 'splash-screen';

    // Create the modal content
    splashScreen.innerHTML = `
        <div class="splash-modal">
            <div class="splash-logo">
                <img src="assets/images/logo_peoplefirst-01.svg" alt="People First Urgent Care Logo">
            </div>
            <div class="splash-content">
                <h2>Welcome to People First Urgent Care</h2>
                <p>Quality healthcare when you need it most. We're dedicated to providing exceptional medical services with minimal wait times.</p>
                <div class="splash-question">
                    <p>Would you like to see a quick introduction to our services?</p>
                </div>
                <div class="splash-buttons">
                    <button class="splash-btn splash-btn-primary" id="splash-watch-video">Yes, Show Me</button>
                    <button class="splash-btn splash-btn-secondary" id="splash-skip">No, Skip</button>
                </div>
            </div>
            <div class="splash-bg" id="splash-animation"></div>
        </div>

        <!-- Video Modal (Hidden Initially) -->
        <div class="splash-video-container" id="splash-video-modal" style="display: none;">
            <div class="splash-video-content">
                <button class="splash-video-close" id="splash-video-close">&times;</button>
                <div class="splash-video-player">
                    <video id="splash-video" controls preload="metadata" poster="assets/images/video-poster.jpg">
                        <source src="videos/welcome-video.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="video-loading" id="video-loading">
                        <div class="loading-spinner"></div>
                        <span>Loading video...</span>
                    </div>
                </div>
                <div class="splash-video-controls">
                    <button class="splash-btn splash-btn-primary" id="splash-continue-after-video">Continue to Site</button>
                </div>
            </div>
        </div>
    `;

    // Add to the document
    document.body.appendChild(splashScreen);

    // Add event listeners
    document.getElementById('splash-watch-video').addEventListener('click', function() {
        showVideoModal();
    });

    document.getElementById('splash-skip').addEventListener('click', function() {
        hideSplashScreen();
        rememberVisitor();
    });

    document.getElementById('splash-video-close').addEventListener('click', function() {
        hideVideoModal();
    });

    document.getElementById('splash-continue-after-video').addEventListener('click', function() {
        hideVideoModal();
        hideSplashScreen();
        rememberVisitor();
    });

    // Initialize background animation
    initBackgroundAnimation();
}

/**
 * Show the video modal
 */
function showVideoModal() {
    const videoModal = document.getElementById('splash-video-modal');
    const video = document.getElementById('splash-video');
    const loadingIndicator = document.getElementById('video-loading');

    if (!videoModal || !video) return;

    // Show the modal
    videoModal.style.display = 'flex';

    // Show loading indicator
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }

    // Handle video loading
    video.addEventListener('canplay', function videoCanPlay() {
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        // Remove event listener to prevent multiple calls
        video.removeEventListener('canplay', videoCanPlay);
    });

    // Handle video loading error
    video.addEventListener('error', function videoError() {
        console.error('Video loading error');
        if (loadingIndicator) {
            loadingIndicator.innerHTML = '<p>Error loading video. Please try again later.</p>';
        }
    });

    // Play the video
    try {
        video.load(); // Ensure video is loaded

        // Play when ready
        video.addEventListener('loadedmetadata', function() {
            try {
                video.play().catch(e => console.warn('Auto-play prevented:', e));
            } catch (error) {
                console.warn('Auto-play prevented:', error);
            }
        });
    } catch (error) {
        console.warn('Video loading error:', error);
    }
}

/**
 * Hide the video modal
 */
function hideVideoModal() {
    const videoModal = document.getElementById('splash-video-modal');
    const video = document.getElementById('splash-video');

    if (!videoModal || !video) return;

    // Pause the video
    video.pause();

    // Hide the modal
    videoModal.style.display = 'none';
}

/**
 * Show the splash screen with animation
 */
function showSplashScreen() {
    const splashScreen = document.querySelector('.splash-screen');
    if (!splashScreen) return;

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Show with animation
    setTimeout(() => {
        splashScreen.classList.add('active');
    }, 500);

    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
}

/**
 * Hide the splash screen with animation
 */
function hideSplashScreen() {
    const splashScreen = document.querySelector('.splash-screen');
    if (!splashScreen) return;

    // Hide with animation
    splashScreen.classList.remove('active');

    // Restore body scrolling after animation completes
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 500);

    // Remove escape key listener
    document.removeEventListener('keydown', handleEscapeKey);
}

/**
 * Handle escape key press to close splash screen
 */
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        hideSplashScreen();
        rememberVisitor();
    }
}

/**
 * Remember that the user has visited the site
 */
function rememberVisitor() {
    try {
        localStorage.setItem('pfuc_has_visited', 'true');
        console.log('Visit status saved to localStorage');
    } catch (error) {
        console.warn('Could not save visit status to localStorage:', error);
    }
}

/**
 * Initialize the background animation
 * Creates an advanced particle effect using Three.js
 */
function initBackgroundAnimation() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not available, falling back to simple animation');
        initSimpleAnimation();
        return;
    }

    // Use the advanced Three.js animation
    try {
        initSplashAnimation();
    } catch (error) {
        console.error('Error initializing Three.js animation:', error);
        initSimpleAnimation();
    }
}

/**
 * Fallback simple animation using canvas
 */
function initSimpleAnimation() {
    const container = document.getElementById('splash-animation');
    if (!container) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Particle settings
    const particleCount = 30;
    const particles = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: `rgba(4, 135, 73, ${Math.random() * 0.5 + 0.1})`,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }

    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }

            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });

        // Request next frame
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });
}

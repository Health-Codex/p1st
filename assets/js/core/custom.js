/**
 * People First Urgent Care - Website Redesign
 * Custom JavaScript for Static HTML Site
 * Version: 1.1.0 - Enhanced Features
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Pre-load critical elements to prevent delayed text rendering
        preloadCriticalElements();

        // Initialize all components
        initMobileMenu();
        initDirectionsLinks();
        initBackToTop();
        initFaqAccordion();
        initFormValidation();
        initStickyHeader();
        initSmoothScroll();
        initAnimations();
        initTestimonialCarousel();
        initImageCarousel();
        initLocationMap();
        initInsuranceFilter();
        initServiceTabs();
        initServiceModal();
        initServiceComparison();
        initParallaxEffect();
        initCounterAnimation();
        initImageLightbox();
        initAdvancedAnimations();
        initAboutPageAnimations();
        initPatientServicesAnimations();
        initAccessibilityFeatures();
        initLazyLoading();
        initCtaEnhancements();
    });

    /**
     * Preload critical elements to ensure immediate display
     * Ensures contact options are fully visible without animations
     */
    function preloadCriticalElements() {
        // Ensure contact options are fully visible immediately
        const contactOptions = document.querySelectorAll('.contact-option');
        if (contactOptions.length > 0) {
            // Force immediate display without animations
            contactOptions.forEach(option => {
                // Ensure full visibility without transitions
                option.style.opacity = '1';

                // Ensure all child elements are fully visible
                const heading = option.querySelector('h3');
                const paragraph = option.querySelector('p');
                const icon = option.querySelector('.contact-icon');

                if (heading) {
                    heading.style.opacity = '1';
                }

                if (paragraph) {
                    paragraph.style.opacity = '1';
                }

                if (icon) {
                    icon.style.opacity = '1';
                }
            });
        }
    }

    /**
     * Smart Directions Links
     * - Default: Apple Maps (iOS/macOS and other non-Android)
     * - Android: Google Maps
     * Works for any anchor with class .directions-btn and data-address or data-lat/data-lon
     */
    function initDirectionsLinks() {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        function buildUrl(anchor) {
            const lat = anchor.getAttribute('data-lat');
            const lon = anchor.getAttribute('data-lon');
            const address = anchor.getAttribute('data-address') || '';
            const hasCoords = lat && lon;
            if (isAndroid) {
                // Google Maps driving directions
                if (hasCoords) {
                    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat + ',' + lon)}`;
                }
                return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
            } else {
                // Apple Maps (default)
                if (hasCoords) {
                    return `https://maps.apple.com/?daddr=${encodeURIComponent(lat + ',' + lon)}`;
                }
                return `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
            }
        }

        // Delegate clicks so dynamically-added links work
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a.directions-btn');
            if (!link) return;
            const url = buildUrl(link);
            if (!url) return;
            e.preventDefault();
            try {
                window.open(url, link.getAttribute('target') || '_blank', 'noopener');
            } catch (_) {
                window.location.href = url;
            }
        });
    }

    /**
     * Mobile Menu Toggle with Overlay and Enhanced Dropdown Navigation
     * Optimized for touch devices with improved accessibility
     */
    function initMobileMenu() {
        // Support both historical toggles: `.mobile-menu-toggle` and `.mobile-toggle`
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle, .mobile-toggle, [aria-label*="Toggle mobile menu"]');
        const mainNavigation = document.querySelector('.main-navigation');
        const body = document.body;
        const isMobile = window.innerWidth <= 1024;

        // Detect touch device
        const isTouchDevice = ('ontouchstart' in window) ||
                             (navigator.maxTouchPoints > 0) ||
                             (navigator.msMaxTouchPoints > 0);

        // Add touch device class to body if applicable
        if (isTouchDevice) {
            body.classList.add('touch-device');
        }

        // Create overlay element if it doesn't exist
        let overlay = document.querySelector('.mobile-menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            body.appendChild(overlay);
        }

        // Ensure modern mobile nav chrome (header with logo + close, sticky CTAs)
        function ensureModernMobileNav() {

            // Add a marker class so styles can target the modern layout without
            // disturbing other header implementations present in this repo
            if (mainNavigation) {
                mainNavigation.classList.add('modern-mobile-nav');
            }

            // Header: logo + close button
            if (!mainNavigation.querySelector('.mobile-menu-header')) {
                const header = document.createElement('div');
                header.className = 'mobile-menu-header';

                const logoWrap = document.createElement('div');
                logoWrap.className = 'mobile-menu-logo';
                const logoImg = document.querySelector('.logo img');
                if (logoImg) {
                    // Clone to avoid moving the original out of the header
                    const clone = logoImg.cloneNode(true);
                    // Defensive: constrain via inline style in case other CSS overrides
                    clone.style.height = '32px';
                    clone.style.width = 'auto';
                    logoWrap.appendChild(clone);
                } else {
                    // Fallback: simple site name text
                    const site = document.createElement('strong');
                    site.textContent = 'Menu';
                    logoWrap.appendChild(site);
                }

                const closeBtn = document.createElement('button');
                closeBtn.className = 'mobile-menu-close';
                closeBtn.setAttribute('aria-label', 'Close navigation menu');
                closeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
                closeBtn.addEventListener('click', () => closeMobileMenu());

                header.appendChild(logoWrap);
                header.appendChild(closeBtn);

                // Insert at the very top of the nav
                mainNavigation.insertBefore(header, mainNavigation.firstChild);
            }

            // Inject icons on primary items (once)
            if (mainNavigation && !mainNavigation.dataset.iconsApplied) {
                const iconMap = [
                    { match: 'index.html', icon: 'fa-house' },
                    { match: 'about',      icon: 'fa-circle-info' },
                    { match: 'our-staff',  icon: 'fa-user-nurse' },
                    { match: 'patient',    icon: 'fa-notes-medical' },
                    { match: 'telemedicine', icon: 'fa-video' },
                    { match: 'insurance',  icon: 'fa-shield-halved' },
                    { match: 'contact',    icon: 'fa-location-dot' },
                    { match: 'gallery',    icon: 'fa-images' }
                ];
                const topLinks = mainNavigation ? mainNavigation.querySelectorAll('.nav-menu > .nav-item > a') : [];
                topLinks.forEach(a => {
                    // Skip if already has an icon
                    if (a.querySelector('.nav-icon')) return;
                    const href = (a.getAttribute('href') || '').toLowerCase();
                    const text = a.textContent.trim().toLowerCase();
                    const found = iconMap.find(m => href.includes(m.match) || text.includes(m.match));
                    const ic = document.createElement('span');
                    ic.className = 'nav-icon';
                    ic.innerHTML = `<i class="fa-solid ${found ? found.icon : 'fa-circle'}" aria-hidden="true"></i>`;
                    a.prepend(ic);
                });
                if (mainNavigation) mainNavigation.dataset.iconsApplied = 'true';
            }

            // Add chevron toggle buttons for dropdown parents (mobile-friendly)
            const parents = mainNavigation ? mainNavigation.querySelectorAll('.nav-item.has-dropdown') : [];
            parents.forEach(parent => {
                const link = parent.querySelector(':scope > a');
                const submenu = parent.querySelector(':scope > .dropdown-menu, :scope > .sub-menu');
                if (!link || !submenu) return;

                // If a dedicated toggle doesn't exist, create it
                let toggle = parent.querySelector(':scope > .submenu-toggle');
                if (!toggle) {
                    toggle = document.createElement('button');
                    toggle.className = 'submenu-toggle';
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.setAttribute('aria-label', `Toggle ${link.textContent.trim()} menu`);
                    toggle.innerHTML = '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
                    parent.appendChild(toggle);
                }

                // Ensure mobile behavior: expand/collapse with animation
                if (!toggle.dataset.bound) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const isOpen = submenu.classList.contains('active');

                        // Close any other open submenus in mobile context
                        if (window.innerWidth <= 1024) {
                            mainNavigation.querySelectorAll('.dropdown-menu.active, .sub-menu.active').forEach(m => {
                                if (m !== submenu) {
                                    m.style.maxHeight = '0px';
                                    m.classList.remove('active');
                                    const p = m.closest('.nav-item.has-dropdown');
                                    if (p) {
                                        p.classList.remove('submenu-active');
                                        const t = p.querySelector(':scope > .submenu-toggle');
                                        if (t) {
                                            t.classList.remove('active');
                                            t.setAttribute('aria-expanded', 'false');
                                        }
                                    }
                                }
                            });
                        }

                        if (!isOpen) {
                            submenu.classList.add('active');
                            submenu.style.maxHeight = submenu.scrollHeight + 'px';
                            parent.classList.add('submenu-active');
                            toggle.classList.add('active');
                            toggle.setAttribute('aria-expanded', 'true');
                        } else {
                            submenu.style.maxHeight = '0px';
                            toggle.setAttribute('aria-expanded', 'false');
                            toggle.classList.remove('active');
                            parent.classList.remove('submenu-active');
                            setTimeout(() => submenu.classList.remove('active'), 300);
                        }
                    });
                    toggle.dataset.bound = 'true';
                }
            });

            // Submenu item icons (Patient Services & Locations)
            const subAnchors = mainNavigation ? mainNavigation.querySelectorAll('.dropdown-menu a, .sub-menu a') : [];
            subAnchors.forEach(a => {
                if (a.querySelector('.nav-icon')) return;
                const href = (a.getAttribute('href')||'').toLowerCase();
                const text = (a.textContent||'').trim().toLowerCase();
                let icon = 'fa-circle';
                if (/lab|laboratory/.test(href+text)) icon = 'fa-vial';
                else if (/x-?ray|imaging|ultrasound/.test(href+text)) icon = 'fa-x-ray';
                else if (/vaccin|immuniz/.test(href+text)) icon = 'fa-syringe';
                else if (/physical/.test(href+text)) icon = 'fa-user-check';
                else if (/urgent/.test(href+text)) icon = 'fa-kit-medical';
                else if (/primary/.test(href+text)) icon = 'fa-user-doctor';
                else if (/telemedicine|virtual/.test(href+text)) icon = 'fa-video';
                else if (/collierville|southaven|germantown|olive|bartlett/.test(href+text)) icon = 'fa-location-dot';
                const ic = document.createElement('span'); ic.className='nav-icon'; ic.innerHTML=`<i class="fa-solid ${icon}"></i>`;
                a.prepend(ic);
            });

            // Sticky CTA actions at the bottom of the drawer
            if (mainNavigation && !mainNavigation.querySelector('.mobile-actions')) {
                const actions = document.createElement('div');
                actions.className = 'mobile-actions';

                const save = document.createElement('a');
                save.href = 'save-your-spot.html';
                save.className = 'btn btn-primary mobile-btn';
                save.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Save Your Spot';

                const pay = document.createElement('a');
                pay.href = 'payment.html';
                pay.className = 'btn btn-secondary mobile-btn';
                pay.textContent = 'Pay Now';

                actions.appendChild(save);
                actions.appendChild(pay);

                mainNavigation.appendChild(actions);
            }

            // Utility zone: Search + quick actions (inserted once just after header)
            if (!mainNavigation.querySelector('.mobile-utility')) {
                const util = document.createElement('div');
                util.className = 'mobile-utility';

                // Search
                const searchWrap = document.createElement('div');
                searchWrap.className = 'mobile-search';
                searchWrap.innerHTML = `
                    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input type="search" placeholder="Search menu" aria-label="Search menu" />
                `;

                // Quick actions
                const quick = document.createElement('div');
                quick.className = 'mobile-quick-actions';
                quick.innerHTML = `
                    <a class=\"chip\" href=\"contact-numbers.html\"><i class=\"fa-solid fa-phone\"></i> Call</a>
                    <a class=\"chip\" data-action=\"nearest\" href=\"#\"><i class=\"fa-solid fa-location-crosshairs\"></i> Nearest</a>
                    <a class=\"chip\" href=\"contact.html\"><i class=\"fa-regular fa-clock\"></i> Hours</a>
                `;

                util.appendChild(searchWrap);
                util.appendChild(quick);

                const header = mainNavigation.querySelector('.mobile-menu-header');
                if (header && header.nextSibling) {
                    header.parentNode.insertBefore(util, header.nextSibling);
                } else {
                    mainNavigation.insertBefore(util, mainNavigation.firstChild);
                }

                // Hook up filtering
                const input = searchWrap.querySelector('input');
                if (input) {
                    input.addEventListener('input', () => {
                        const q = (input.value || '').trim();
                        // For 0–1 chars, lightly filter menu; for 2+ chars, reset menu (global search takes over)
                        if (q.length <= 1) {
                            filterMenu(q);
                        } else {
                            filterMenu('');
                        }
                    });
                }

                // Notify search module to (re)bind
                try { window.dispatchEvent(new CustomEvent('pf:mobile-search-ready')); } catch(_) {}
            }

            // Section labels to create hierarchy (insert once)
            if (mainNavigation && !mainNavigation.dataset.sectionsApplied) {
                const list = mainNavigation.querySelector('.nav-menu');
                if (list) {
                    const sections = [
                        { title: 'Explore', matchers: ['home', 'about', 'our staff', 'gallery'] },
                        { title: 'Care Options', matchers: ['patient', 'telemedicine', 'insurance'] },
                        { title: 'Locations', matchers: ['locations'] }
                    ];

                    sections.forEach(sec => {
                        // Find first matching item
                        const item = Array.from(list.children).find(li => {
                            const a = li.querySelector(':scope > a');
                            if (!a) return false;
                            const t = a.textContent.trim().toLowerCase();
                            return sec.matchers.some(m => t.includes(m));
                        });
                        if (item && !item.previousElementSibling?.classList?.contains('menu-section-label')) {
                            const label = document.createElement('li');
                            label.className = 'menu-section-label';
                            label.setAttribute('role', 'heading');
                            label.setAttribute('aria-level', '2');
                            label.textContent = sec.title;
                            list.insertBefore(label, item);
                        }
                    });
                }
                mainNavigation.dataset.sectionsApplied = 'true';
            }

            // Mirror enhancements for legacy/mobile-only container if present
            const legacyMenu = document.querySelector('.mobile-menu');
            if (legacyMenu) {
                legacyMenu.classList.add('modern-mobile-sheet');

                // Ensure header elements exist and bind close
                let legacyHeader = legacyMenu.querySelector('.mobile-menu-header');
                if (!legacyHeader) {
                    legacyHeader = document.createElement('div');
                    legacyHeader.className = 'mobile-menu-header';
                    legacyHeader.innerHTML = `
                        <div class="mobile-menu-logo"></div>
                        <button class="mobile-menu-close" aria-label="Close navigation menu"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
                    `;
                    legacyMenu.insertBefore(legacyHeader, legacyMenu.firstChild);
                }
                const legacyClose = legacyHeader.querySelector('.mobile-menu-close');
                if (legacyClose && !legacyClose.dataset.bound) {
                    legacyClose.addEventListener('click', () => {
                        // Close both states to be safe
                        document.body.classList.remove('mobile-menu-active', 'mobile-menu-open');
                        legacyMenu.classList.remove('active');
                    });
                    legacyClose.dataset.bound = 'true';
                }

                // Utility zone for legacy menu
                if (!legacyMenu.querySelector('.mobile-utility')) {
                    const util = document.createElement('div');
                    util.className = 'mobile-utility';
                    util.innerHTML = `
                        <div class="mobile-search">
                            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                            <input type="search" placeholder="Search menu" aria-label="Search menu" />
                        </div>
                        <div class=\"mobile-quick-actions\">
                            <a class=\"chip\" href=\"contact-numbers.html\"><i class=\"fa-solid fa-phone\"></i> Call</a>
                            <a class=\"chip\" data-action=\"nearest\" href=\"#\"><i class=\"fa-solid fa-location-crosshairs\"></i> Nearest</a>
                            <a class=\"chip\" href=\"contact.html\"><i class=\"fa-regular fa-clock\"></i> Hours</a>
                        </div>
                    `;
                    const insertAfter = legacyHeader.nextSibling;
                    legacyMenu.insertBefore(util, insertAfter);

                    const input = util.querySelector('input');
                    if (input) input.addEventListener('input', () => {
                        const q = (input.value || '').trim();
                        if (q.length <= 1) {
                            filterLegacyMenu(q);
                        } else {
                            filterLegacyMenu('');
                        }
                    });

                    // Notify search module to (re)bind
                    try { window.dispatchEvent(new CustomEvent('pf:mobile-search-ready')); } catch(_) {}
                }

                // Icons for legacy links (works across both ul/li and div-based structures)
                if (!legacyMenu.dataset.iconsApplied) {
                    const iconMap = [
                        { match: 'home', icon: 'fa-house' },
                        { match: 'about', icon: 'fa-circle-info' },
                        { match: 'staff', icon: 'fa-user-nurse' },
                        { match: 'patient', icon: 'fa-notes-medical' },
                        { match: 'telemedicine', icon: 'fa-video' },
                        { match: 'insurance', icon: 'fa-shield-halved' },
                        { match: 'locations', icon: 'fa-location-dot' },
                        { match: 'gallery', icon: 'fa-images' },
                        { match: 'pay', icon: 'fa-credit-card' }
                    ];
                    const anchors = legacyMenu.querySelectorAll('a');
                    anchors.forEach(a => {
                        if (a.closest('.mobile-actions')) return;
                        if (a.querySelector('.nav-icon')) return;
                        const txt = (a.textContent || '').trim().toLowerCase();
                        const href = (a.getAttribute('href') || '').toLowerCase();
                        const found = iconMap.find(m => txt.includes(m.match) || href.includes(m.match));
                        const wrap = document.createElement('span');
                        wrap.className = 'nav-icon';
                        wrap.innerHTML = `<i class="fa-solid ${found ? found.icon : 'fa-circle'}"></i>`;
                        a.prepend(wrap);
                    });
                    legacyMenu.dataset.iconsApplied = 'true';
                }

                // Sticky CTAs for legacy container
                if (!legacyMenu.querySelector('.mobile-actions')) {
                    const actions = document.createElement('div');
                    actions.className = 'mobile-actions';
                    actions.innerHTML = `
                        <a href="save-your-spot.html" class="btn btn-primary mobile-btn"><i class="fa-solid fa-calendar-check"></i> Save Your Spot</a>
                        <a href="payment.html" class="btn btn-secondary mobile-btn">Pay Now</a>
                    `;
                    legacyMenu.appendChild(actions);
                }
            }
        }

        // Focus trap while drawer is open
        let lastFocused = null;
        function trapFocus(container) {
            const selectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
            const focusables = Array.from(container.querySelectorAll(selectors)).filter(el => el.offsetParent !== null);
            if (focusables.length === 0) return () => {};
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            function handler(e) {
                if (e.key !== 'Tab') return;
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
            document.addEventListener('keydown', handler);
            return () => document.removeEventListener('keydown', handler);
        }

        // Swipe-to-close on touch devices
        let removeSwipeHandlers = () => {};
        function enableSwipeToClose(panel) {
            let startX = 0;
            let currentX = 0;
            let dragging = false;
            const threshold = 60;

            function onStart(e) {
                const t = e.touches ? e.touches[0] : e;
                startX = t.clientX;
                currentX = startX;
                dragging = true;
                panel.style.transition = 'none';
            }
            function onMove(e) {
                if (!dragging) return;
                const t = e.touches ? e.touches[0] : e;
                currentX = t.clientX;
                const dx = Math.min(Math.max(0, currentX - startX), panel.offsetWidth);
                // Move the panel to the right to follow the finger
                panel.style.transform = `translateX(${dx}px)`;
            }
            function onEnd() {
                if (!dragging) return;
                const dx = currentX - startX;
                panel.style.transition = '';
                panel.style.transform = '';
                dragging = false;
                if (dx > threshold) {
                    closeMobileMenu();
                }
            }
            panel.addEventListener('touchstart', onStart, { passive: true });
            panel.addEventListener('touchmove', onMove, { passive: true });
            panel.addEventListener('touchend', onEnd, { passive: true });
            removeSwipeHandlers = () => {
                panel.removeEventListener('touchstart', onStart);
                panel.removeEventListener('touchmove', onMove);
                panel.removeEventListener('touchend', onEnd);
                removeSwipeHandlers = () => {};
            };
        }

        // Highlight current page link when drawer opens
        function highlightCurrentLink() {
            try {
                const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
                mainNavigation.querySelectorAll('.nav-link').forEach(a => {
                    const href = (a.getAttribute('href') || '').toLowerCase();
                    if (href && path && href.endsWith(path)) {
                        a.setAttribute('aria-current', 'page');
                        a.classList.add('active');
                    }
                });
            } catch (_) {}
        }

        // Function to open mobile menu
        function openMobileMenu() {
            // Build the modern chrome on first open
            ensureModernMobileNav();
            body.classList.add('mobile-menu-active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');

            // Prevent background scrolling
            body.dataset.prevOverflow = body.style.overflow || '';
            body.style.overflow = 'hidden';

            // Inert background if supported
            const main = document.querySelector('main, #main-content');
            if (main) {
                try { main.setAttribute('inert', ''); } catch(_) {}
                main.setAttribute('aria-hidden', 'true');
            }

            // Update icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-xmark';
            }

            // Focus on first menu item for accessibility
            const firstMenuItem = mainNavigation.querySelector('.menu > li > a, .nav-menu > li > a, .mobile-menu-header .mobile-menu-close');
            if (firstMenuItem) {
                setTimeout(() => {
                    firstMenuItem.focus();
                }, 100);
            }

            // Current page highlight
            highlightCurrentLink();

            // Apply focus trap and swipe gesture
            lastFocused = document.activeElement;
            if (mainNavigation) {
                if (!mainNavigation._releaseFocus) {
                    mainNavigation._releaseFocus = trapFocus(mainNavigation);
                }
                enableSwipeToClose(mainNavigation);
                // Shadow on scroll inside the drawer
                if (!mainNavigation._scrollBound) {
                    mainNavigation.addEventListener('scroll', () => {
                        if (mainNavigation.scrollTop > 0) {
                            mainNavigation.classList.add('scrolled');
                        } else {
                            mainNavigation.classList.remove('scrolled');
                        }
                    }, { passive: true });
                    mainNavigation._scrollBound = true;
                }
            }
        }

        // Function to close mobile menu
        function closeMobileMenu() {
            body.classList.remove('mobile-menu-active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');

            // Restore background scrolling
            body.style.overflow = body.dataset.prevOverflow || '';
            delete body.dataset.prevOverflow;

            // Remove inert/background hiding
            const main = document.querySelector('main, #main-content');
            if (main) {
                try { main.removeAttribute('inert'); } catch(_) {}
                main.removeAttribute('aria-hidden');
            }

            // Update icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-bars';
            }

            // Return focus to toggle button for accessibility
            setTimeout(() => {
                (mobileMenuToggle || lastFocused || document.body).focus();
            }, 100);

            // Release focus trap and swipe listeners
            if (mainNavigation && mainNavigation._releaseFocus) {
                mainNavigation._releaseFocus();
                mainNavigation._releaseFocus = null;
            }
            removeSwipeHandlers();
        }

        // Filter menu items by text
        function filterMenu(query) {
            const q = (query || '').trim().toLowerCase();
            const items = mainNavigation ? mainNavigation.querySelectorAll('.nav-menu > li') : [];
            let visible = 0;
            items.forEach(li => {
                const text = (li.textContent || '').trim().toLowerCase();
                const match = !q || text.includes(q);
                li.style.display = match ? '' : 'none';
                if (match) visible++;
            });

            // Show/hide section labels based on following visible items
            const labels = mainNavigation ? mainNavigation.querySelectorAll('.menu-section-label') : [];
            labels.forEach(label => {
                let sib = label.nextElementSibling;
                let any = false;
                while (sib && sib.classList && !sib.classList.contains('menu-section-label')) {
                    if (sib.style.display !== 'none') { any = true; break; }
                    sib = sib.nextElementSibling;
                }
                label.style.display = any ? '' : 'none';
            });

            // Optional: show a friendly empty state
            let empty = mainNavigation ? mainNavigation.querySelector('.menu-empty') : null;
            if (!empty) {
                empty = document.createElement('div');
                empty.className = 'menu-empty';
                empty.textContent = 'No matches found';
                empty.style.display = 'none';
                mainNavigation && mainNavigation.appendChild(empty);
            }
            empty.style.display = (visible === 0) ? 'block' : 'none';
        }

        // Filter for legacy menu structures
        function filterLegacyMenu(query) {
            const legacyMenu = document.querySelector('.mobile-menu');
            if (!legacyMenu) return;
            const q = (query || '').trim().toLowerCase();
            const blockItems = legacyMenu.querySelectorAll('.mobile-nav-link, .mobile-menu-nav > li, .mobile-nav-menu > li');
            let visible = 0;
            blockItems.forEach(el => {
                const text = (el.textContent || '').trim().toLowerCase();
                const match = !q || text.includes(q);
                if (el.tagName === 'A') {
                    el.style.display = match ? '' : 'none';
                    if (match) visible++;
                } else {
                    // li or container
                    el.style.display = match ? '' : 'none';
                    if (match) visible++;
                }
            });
            let empty = legacyMenu.querySelector('.menu-empty');
            if (!empty) {
                empty = document.createElement('div');
                empty.className = 'menu-empty';
                empty.textContent = 'No matches found';
                empty.style.display = 'none';
                legacyMenu.appendChild(empty);
            }
            empty.style.display = (visible === 0) ? 'block' : 'none';
        }

        if (mobileMenuToggle && mainNavigation) {
            // Toggle menu on button click
            mobileMenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Mobile menu toggle clicked');

                if (body.classList.contains('mobile-menu-active')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });

            // Close menu when clicking on overlay
            overlay.addEventListener('click', closeMobileMenu);

            // Close menu when pressing Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && body.classList.contains('mobile-menu-active')) {
                    closeMobileMenu();
                }
            });

            // Add accessibility attributes
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        }
        else {
            // Header is injected asynchronously on most pages.
            // Poll briefly to attach handlers once it's available.
            let attempts = 0;
            const poll = setInterval(() => {
                const t = document.querySelector('.mobile-menu-toggle, .mobile-toggle, [aria-label*="Toggle mobile menu"]');
                const n = document.querySelector('.main-navigation');
                if (t) {
                    clearInterval(poll);
                    // Build chrome immediately so styles apply even before first open
                    ensureModernMobileNav();
                    t.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (document.body.classList.contains('mobile-menu-active')) {
                            closeMobileMenu();
                        } else {
                            openMobileMenu();
                        }
                    });
                    t.setAttribute('aria-expanded', 'false');
                    t.setAttribute('aria-label', 'Toggle navigation menu');
                }
                if (++attempts > 25) clearInterval(poll);
            }, 150);
        }

        // Handle submenu toggles with enhanced mobile experience
        const submenuToggles = document.querySelectorAll('.submenu-toggle');

        submenuToggles.forEach(toggle => {
            const parentItem = toggle.closest('.menu-item-has-children');
            const submenu = parentItem.querySelector('.sub-menu');
            const parentLink = parentItem.querySelector('a');
            const isPatientServices = parentLink && parentLink.getAttribute('href') === 'patient-services.html';

            if (toggle && submenu) {
                // Set initial ARIA states
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Toggle submenu');

                // Increase touch target size for mobile
                if (isTouchDevice) {
                    toggle.classList.add('touch-target');
                }

                // Add special class for Patient Services dropdown
                if (isPatientServices) {
                    parentItem.classList.add('patient-services-menu');
                    submenu.classList.add('patient-services-submenu');
                }

                // Toggle submenu on click with enhanced animation
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // For mobile view, toggle active class with animation
                    if (isMobile) {
                        // Close other open submenus first
                        const otherOpenSubmenus = document.querySelectorAll('.sub-menu.active');
                        const otherOpenToggles = document.querySelectorAll('.submenu-toggle.active');

                        otherOpenSubmenus.forEach(menu => {
                            if (menu !== submenu) {
                                menu.classList.remove('active');
                                menu.style.maxHeight = '0';
                            }
                        });

                        otherOpenToggles.forEach(btn => {
                            if (btn !== toggle) {
                                btn.classList.remove('active');
                                btn.setAttribute('aria-expanded', 'false');
                                const btnIcon = btn.querySelector('i');
                                if (btnIcon) {
                                    btnIcon.className = 'fa-solid fa-chevron-down';
                                }
                            }
                        });

                        // Toggle current submenu with smooth animation
                        const isExpanded = this.classList.contains('active');

                        if (!isExpanded) {
                            // Opening submenu
                            submenu.classList.add('active');
                            this.classList.add('active');

                            // Animate height for smooth transition
                            submenu.style.maxHeight = submenu.scrollHeight + 'px';

                            // Add active class to parent for styling
                            parentItem.classList.add('submenu-active');

                            // Update ARIA states
                            this.setAttribute('aria-expanded', 'true');

                            // Update icon with animation
                            const icon = this.querySelector('i');
                            if (icon) {
                                icon.className = 'fa-solid fa-chevron-up';
                                icon.style.transform = 'rotate(180deg)';
                            }

                            // Special animation for Patient Services
                            if (isPatientServices) {
                                const submenuItems = submenu.querySelectorAll('li');
                                submenuItems.forEach((item, index) => {
                                    item.style.transitionDelay = `${0.05 * index}s`;
                                    item.style.opacity = '0';
                                    item.style.transform = 'translateX(10px)';
                                    setTimeout(() => {
                                        item.style.opacity = '1';
                                        item.style.transform = 'translateX(0)';
                                    }, 50);
                                });
                            }
                        } else {
                            // Closing submenu
                            submenu.style.maxHeight = '0';

                            // Remove active classes after animation completes
                            setTimeout(() => {
                                submenu.classList.remove('active');
                                this.classList.remove('active');
                                parentItem.classList.remove('submenu-active');
                            }, 300);

                            // Update ARIA states
                            this.setAttribute('aria-expanded', 'false');

                            // Update icon with animation
                            const icon = this.querySelector('i');
                            if (icon) {
                                icon.className = 'fa-solid fa-chevron-down';
                                icon.style.transform = 'rotate(0deg)';
                            }
                        }
                    } else {
                        // For desktop, we'll use hover, but this handles click as fallback
                        submenu.classList.toggle('active');
                        this.classList.toggle('active');
                        parentItem.classList.toggle('submenu-active');

                        // Update ARIA states
                        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                        this.setAttribute('aria-expanded', !expanded);
                    }
                });

                // For touch devices, make parent link tappable separately from submenu toggle
                if (isTouchDevice && parentLink) {
                    parentLink.addEventListener('click', function(e) {
                        if (isMobile) {
                            // Don't navigate on first tap if submenu is closed
                            if (!submenu.classList.contains('active')) {
                                e.preventDefault();
                                toggle.click(); // Open the submenu instead
                            }
                        }
                    });
                }

                // For desktop: Close submenu when clicking outside
                if (!isMobile) {
                    document.addEventListener('click', function(e) {
                        if (!parentItem.contains(e.target)) {
                            submenu.classList.remove('active');
                            toggle.classList.remove('active');
                            parentItem.classList.remove('submenu-active');
                            toggle.setAttribute('aria-expanded', 'false');
                        }
                    });
                }

                // Special hover effect for Patient Services on desktop
                if (!isMobile && isPatientServices) {
                    parentItem.addEventListener('mouseenter', function() {
                        // Add subtle animation to submenu items
                        const submenuItems = submenu.querySelectorAll('li');
                        submenuItems.forEach((item, index) => {
                            item.style.transitionDelay = `${0.05 * index}s`;
                        });
                    });
                }
            }
        });

        // Handle keyboard navigation for accessibility
        const menuItems = document.querySelectorAll('.menu > li');

        menuItems.forEach(item => {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.sub-menu');
            const toggle = item.querySelector('.submenu-toggle');

            if (link) {
                link.addEventListener('keydown', function(e) {
                    // If item has submenu and user presses down arrow or enter
                    if (submenu && (e.key === 'ArrowDown' || e.key === 'Enter')) {
                        e.preventDefault();

                        // Show submenu
                        submenu.classList.add('active');
                        if (toggle) {
                            toggle.classList.add('active');
                            toggle.setAttribute('aria-expanded', 'true');
                        }

                        // Focus first submenu item
                        const firstSubmenuLink = submenu.querySelector('a');
                        if (firstSubmenuLink) {
                            firstSubmenuLink.focus();
                        }
                    }
                });
            }

            // If this is a submenu item
            if (item.parentElement.classList.contains('sub-menu')) {
                link.addEventListener('keydown', function(e) {
                    // If user presses escape, close submenu and focus parent
                    if (e.key === 'Escape') {
                        e.preventDefault();

                        const parentItem = item.parentElement.closest('.menu-item-has-children');
                        const parentLink = parentItem.querySelector('a');
                        const parentToggle = parentItem.querySelector('.submenu-toggle');

                        // Hide submenu
                        item.parentElement.classList.remove('active');
                        if (parentToggle) {
                            parentToggle.classList.remove('active');
                            parentToggle.setAttribute('aria-expanded', 'false');
                        }

                        // Focus parent link
                        if (parentLink) {
                            parentLink.focus();
                        }
                    }
                });
            }
        });

        // Handle window resize to adjust menu behavior
        window.addEventListener('resize', function() {
            const newIsMobile = window.innerWidth <= 1024;

            // If view mode changed, reset menu state
            if (newIsMobile !== isMobile) {
                // Close mobile menu if switching to desktop
                if (!newIsMobile && body.classList.contains('mobile-menu-active')) {
                    body.classList.remove('mobile-menu-active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');

                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fa-solid fa-bars';
                    }
                }

                // Reset all submenus
                const submenus = document.querySelectorAll('.sub-menu');
                const toggles = document.querySelectorAll('.submenu-toggle');

                submenus.forEach(menu => menu.classList.remove('active'));
                toggles.forEach(toggle => {
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        // Create back to top button if it doesn't exist
        let backToTopButton = document.getElementById('back-to-top');

        if (!backToTopButton) {
            backToTopButton = document.createElement('a');
            backToTopButton.id = 'back-to-top';
            backToTopButton.href = '#';
            backToTopButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
            backToTopButton.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(backToTopButton);
        }

        // Button click event
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }

    /**
     * FAQ Accordion
     */
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        function setItemState(item, shouldOpen) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            item.classList.toggle('active', shouldOpen);

            if (question) {
                question.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            }

            if (answer) {
                if (shouldOpen) {
                    answer.removeAttribute('hidden');
                } else {
                    answer.setAttribute('hidden', '');
                }
            }
        }

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            // Ensure initial state
            setItemState(item, item.classList.contains('active'));

            if (answer && !item.classList.contains('active')) {
                answer.setAttribute('hidden', '');
            }

            if (question) {
                if (!question.hasAttribute('role')) {
                    question.setAttribute('role', 'button');
                }

                if (!question.hasAttribute('tabindex')) {
                    question.setAttribute('tabindex', '0');
                }

                const toggleItem = () => {
                    const shouldOpen = !item.classList.contains('active');

                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            setItemState(otherItem, false);
                        }
                    });

                    setItemState(item, shouldOpen);
                };

                question.addEventListener('click', function(event) {
                    event.preventDefault();
                    toggleItem();
                });

                question.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleItem();
                    }
                });
            }
        });
    }

    /**
     * Form Validation
     */
    function initFormValidation() {
        const contactForm = document.getElementById('contact-form');

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Basic validation
                let isValid = true;
                const requiredFields = contactForm.querySelectorAll('[required]');

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });

                // Email validation
                const emailField = contactForm.querySelector('input[type="email"]');
                if (emailField && emailField.value) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(emailField.value)) {
                        isValid = false;
                        emailField.classList.add('error');
                    }
                }

                if (isValid) {
                    // In a real implementation, this would submit the form
                    // For this mockup, we'll just show a success message
                    const formContainer = contactForm.closest('.form-container');

                    if (formContainer) {
                        formContainer.innerHTML = `
                            <div class="form-success">
                                <i class="fa-solid fa-circle-check"></i>
                                <h2>Thank You!</h2>
                                <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
                            </div>
                        `;
                    }
                }
            });

            // Remove error class on input
            const formInputs = contactForm.querySelectorAll('input, textarea, select');
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                });
            });
        }
    }

    /**
     * Lazy Loading for Images
     * Improves page load performance by loading images only when they enter the viewport
     */
    function initLazyLoading() {
        // Check if the browser supports IntersectionObserver
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);

                        // Log for debugging
                        console.log('Lazy loaded image:', img.src);
                    }
                });
            }, {
                rootMargin: '0px 0px 200px 0px' // Load images when they're 200px from entering the viewport
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });

            console.log(`Initialized lazy loading for ${lazyImages.length} images`);
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                img.classList.add('loaded');
            });
            console.log('Lazy loading fallback applied - browser does not support IntersectionObserver');
        }
    }

    /**
     * Sticky Header
     */
    function initStickyHeader() {
        const header = document.querySelector('.site-header');

        if (header) {
            let lastScrollTop = 0;

            window.addEventListener('scroll', function() {
                const scrollTop = window.scrollY;

                // Add scrolled class when scrolling down
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide header when scrolling down, show when scrolling up
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    header.classList.add('scroll-down');
                    header.classList.remove('scroll-up');
                } else {
                    header.classList.remove('scroll-down');
                    header.classList.add('scroll-up');
                }

                lastScrollTop = scrollTop;
            });
        }
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Scroll Animations - Modified to exclude contact cards
     */
    function initAnimations() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            // Exclude contact-option elements from animations
            const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.contact-option)');

            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Skip contact-option elements
                    if (entry.target.classList.contains('contact-option')) {
                        return;
                    }

                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        // Stop observing once animation is triggered
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            });

            animatedElements.forEach(element => {
                // Skip contact-option elements
                if (!element.classList.contains('contact-option')) {
                    animationObserver.observe(element);
                }
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.contact-option)');
            animatedElements.forEach(element => {
                // Skip contact-option elements
                if (!element.classList.contains('contact-option')) {
                    element.classList.add('animated');
                }
            });
        }

        // Add animation classes to elements, excluding contact-option
        document.querySelectorAll('.service-card, .team-member, .value-card, .testimonial').forEach(element => {
            // Skip contact-option elements
            if (!element.classList.contains('contact-option')) {
                element.classList.add('animate-on-scroll');
                element.classList.add('fade-up');
            }
        });

        // Add staggered animation to service items, excluding contact-option
        const serviceItems = document.querySelectorAll('.service-item:not(.contact-option)');
        serviceItems.forEach((item, index) => {
            // Skip contact-option elements
            if (!item.classList.contains('contact-option')) {
                item.classList.add('animate-on-scroll');
                item.classList.add('fade-up');
                item.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }

    /**
     * Testimonial Carousel
     */
    function initTestimonialCarousel() {
        const testimonialContainer = document.querySelector('.testimonials-grid');

        if (testimonialContainer && window.innerWidth < 768) {
            // Convert grid to carousel on mobile
            testimonialContainer.classList.add('testimonial-carousel');

            const testimonials = testimonialContainer.querySelectorAll('.testimonial');
            let currentIndex = 0;

            // Create navigation buttons
            const navContainer = document.createElement('div');
            navContainer.className = 'carousel-nav';

            const prevButton = document.createElement('button');
            prevButton.className = 'carousel-prev';
            prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

            const nextButton = document.createElement('button');
            nextButton.className = 'carousel-next';
            nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

            navContainer.appendChild(prevButton);
            navContainer.appendChild(nextButton);

            testimonialContainer.parentNode.appendChild(navContainer);

            // Create indicators
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';

            testimonials.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = 'carousel-indicator';
                if (index === 0) indicator.classList.add('active');

                indicator.addEventListener('click', () => {
                    goToSlide(index);
                });

                indicatorsContainer.appendChild(indicator);
            });

            testimonialContainer.parentNode.appendChild(indicatorsContainer);

            // Show only current testimonial
            function updateSlides() {
                testimonials.forEach((testimonial, index) => {
                    testimonial.style.display = index === currentIndex ? 'block' : 'none';
                });

                // Update indicators
                const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
                indicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            }

            function goToSlide(index) {
                currentIndex = index;
                updateSlides();
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % testimonials.length;
                updateSlides();
            }

            function prevSlide() {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                updateSlides();
            }

            // Event listeners
            nextButton.addEventListener('click', nextSlide);
            prevButton.addEventListener('click', prevSlide);

            // Initialize
            updateSlides();

            // Auto-advance slides
            setInterval(nextSlide, 5000);
        }
    }

    /**
     * Image Carousel
     */
    function initImageCarousel() {
        const carousel = document.querySelector('.image-carousel');

        if (carousel) {
            const slides = carousel.querySelectorAll('.carousel-slide');
            const prevButton = document.querySelector('.carousel-prev');
            const nextButton = document.querySelector('.carousel-next');
            const indicators = document.querySelectorAll('.carousel-indicator');

            let currentIndex = 0;
            let isAnimating = false;
            let autoplayInterval;

            // Initialize carousel
            function initCarousel() {
                // Set initial slide
                updateSlides();

                // Start autoplay
                startAutoplay();

                // Add event listeners
                if (prevButton) {
                    prevButton.addEventListener('click', prevSlide);
                }

                if (nextButton) {
                    nextButton.addEventListener('click', nextSlide);
                }

                // Add indicator click events
                indicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => {
                        if (!isAnimating && currentIndex !== index) {
                            goToSlide(index);
                        }
                    });
                });

                // Pause autoplay on hover
                carousel.addEventListener('mouseenter', stopAutoplay);
                carousel.addEventListener('mouseleave', startAutoplay);

                // Add keyboard navigation
                document.addEventListener('keydown', handleKeyboardNavigation);

                // Add touch support
                let touchStartX = 0;
                let touchEndX = 0;

                carousel.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                });

                carousel.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                });

                function handleSwipe() {
                    const swipeThreshold = 50;
                    if (touchEndX < touchStartX - swipeThreshold) {
                        // Swipe left
                        nextSlide();
                    } else if (touchEndX > touchStartX + swipeThreshold) {
                        // Swipe right
                        prevSlide();
                    }
                }
            }

            // Update slides
            function updateSlides() {
                slides.forEach((slide, index) => {
                    // Remove all classes
                    slide.classList.remove('active', 'prev', 'next');

                    // Add appropriate class
                    if (index === currentIndex) {
                        slide.classList.add('active');
                    } else if (index === getPrevIndex()) {
                        slide.classList.add('prev');
                    } else if (index === getNextIndex()) {
                        slide.classList.add('next');
                    }
                });

                // Update indicators
                indicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                        indicator.setAttribute('aria-current', 'true');
                    } else {
                        indicator.classList.remove('active');
                        indicator.removeAttribute('aria-current');
                    }
                });

                // Announce slide change to screen readers
                const liveRegion = document.getElementById('carousel-live-region');
                if (liveRegion) {
                    const activeSlide = slides[currentIndex];
                    const heading = activeSlide.querySelector('h2').textContent;
                    liveRegion.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}: ${heading}`;
                }
            }

            // Go to specific slide
            function goToSlide(index) {
                if (isAnimating) return;

                isAnimating = true;
                currentIndex = index;
                updateSlides();

                // Reset animation flag after transition completes
                setTimeout(() => {
                    isAnimating = false;
                }, 1000);
            }

            // Go to next slide
            function nextSlide() {
                goToSlide(getNextIndex());
            }

            // Go to previous slide
            function prevSlide() {
                goToSlide(getPrevIndex());
            }

            // Get index of next slide
            function getNextIndex() {
                return (currentIndex + 1) % slides.length;
            }

            // Get index of previous slide
            function getPrevIndex() {
                return (currentIndex - 1 + slides.length) % slides.length;
            }

            // Start autoplay
            function startAutoplay() {
                stopAutoplay();
                autoplayInterval = setInterval(nextSlide, 6000);
            }

            // Stop autoplay
            function stopAutoplay() {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                }
            }

            // Handle keyboard navigation
            function handleKeyboardNavigation(e) {
                // Only handle keyboard events when carousel is in viewport
                const rect = carousel.getBoundingClientRect();
                const isInViewport = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );

                if (!isInViewport) return;

                if (e.key === 'ArrowLeft') {
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            }

            // Add accessibility features
            function addAccessibilityFeatures() {
                // Add ARIA attributes
                carousel.setAttribute('aria-roledescription', 'carousel');
                carousel.setAttribute('aria-label', 'Image Carousel');

                // Add live region for screen readers
                let liveRegion = document.getElementById('carousel-live-region');
                if (!liveRegion) {
                    liveRegion = document.createElement('div');
                    liveRegion.id = 'carousel-live-region';
                    liveRegion.className = 'sr-only';
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.setAttribute('aria-atomic', 'true');
                    document.body.appendChild(liveRegion);
                }

                // Add ARIA attributes to slides
                slides.forEach((slide, index) => {
                    slide.setAttribute('role', 'group');
                    slide.setAttribute('aria-roledescription', 'slide');
                    slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
                });
            }

            // Initialize accessibility features
            addAccessibilityFeatures();

            // Initialize carousel
            initCarousel();
        }
    }

    /**
     * Interactive Location Map
     * Optimized for performance with pre-loading and caching
     */
    function initLocationMap() {
        const mapContainer = document.querySelector('.map-container');

        if (mapContainer) {
            // If the page already provides map controls with buttons, avoid generating duplicates
            const existingControls = document.querySelector('.map-section .map-controls');
            if (existingControls && existingControls.querySelector('.map-location-button')) {
                return; // Use the page-provided controls and interaction logic
            }
            // Add map controls
            const mapControls = document.createElement('div');
            mapControls.className = 'map-controls';

            // Cache for location data to improve performance
            const locationCache = new Map();

            // Pre-process all location cards at once to avoid layout thrashing
            const locationButtons = document.querySelectorAll('.location-card');
            const locationData = [];

            // Pre-process all location data first (outside of any event handlers)
            locationButtons.forEach((locationCard, index) => {
                const locationName = locationCard.querySelector('h2') ?
                    locationCard.querySelector('h2').textContent.replace(/^[^a-zA-Z]+/, '') :
                    locationCard.querySelector('h3') ?
                        locationCard.querySelector('h3').textContent.replace(/^[^a-zA-Z]+/, '') :
                        `Location ${index + 1}`;

                // Pre-extract and cache the address
                const address = locationCard.querySelector('address') ?
                    locationCard.querySelector('address').textContent.trim().replace(/\n/g, ' ') : '';

                // Store in our data array
                locationData.push({
                    name: locationName,
                    address: address,
                    element: locationCard,
                    index: index
                });

                // Pre-encode the address for the map URL
                if (address) {
                    const encodedAddress = encodeURIComponent(address);
                    locationCache.set(locationName, encodedAddress);
                }
            });

            // Create all buttons at once
            const fragment = document.createDocumentFragment();

            locationData.forEach((location, index) => {
                const button = document.createElement('button');
                button.className = 'map-location-button';
                if (index === 0) button.classList.add('active');
                button.textContent = location.name;
                button.setAttribute('data-location-index', index);

                // Store button reference in our data structure
                location.button = button;

                fragment.appendChild(button);
            });

            // Append all buttons at once (single DOM operation)
            mapControls.appendChild(fragment);

            // Add event delegation for better performance
            mapControls.addEventListener('click', function(e) {
                if (e.target.classList.contains('map-location-button')) {
                    const button = e.target;
                    const index = parseInt(button.getAttribute('data-location-index'), 10);
                    const location = locationData[index];

                    // Update active button (only modify the DOM when needed)
                    const activeButton = mapControls.querySelector('.map-location-button.active');
                    if (activeButton !== button) {
                        activeButton.classList.remove('active');
                        button.classList.add('active');

                        // Update map iframe with new location (only if we have an address)
                        if (location.address) {
                            const iframe = mapContainer.querySelector('iframe');
                            if (iframe) {
                                // Use cached encoded address for better performance
                                const encodedAddress = locationCache.get(location.name);

                                // Use requestAnimationFrame to optimize the iframe src update
                                requestAnimationFrame(() => {
                                    iframe.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-89.6867!3d35.0423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDAyJzMyLjMiTiA4OcKwNDEnMTIuMSJX!5e0!3m2!1sen!2sus!4v1623252367289!5m2!1sen!2sus&q=${encodedAddress}`;
                                });
                            }
                        }
                    }
                }
            });

            // Insert controls before map (single DOM operation)
            mapContainer.parentNode.insertBefore(mapControls, mapContainer);

            // Pre-select the first location to initialize the map
            if (locationData.length > 0 && locationData[0].address) {
                const iframe = mapContainer.querySelector('iframe');
                if (iframe && !iframe.src.includes('q=')) {
                    const encodedAddress = locationCache.get(locationData[0].name);
                    iframe.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-89.6867!3d35.0423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDAyJzMyLjMiTiA4OcKwNDEnMTIuMSJX!5e0!3m2!1sen!2sus!4v1623252367289!5m2!1sen!2sus&q=${encodedAddress}`;
                }
            }
        }
    }

    /**
     * Insurance Plan and Gallery Filter
     */
    function initInsuranceFilter() {
        const insuranceFilter = document.querySelector('.insurance-filter');
        const galleryFilter = document.querySelector('.gallery-filter');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Handle insurance filter
        if (insuranceFilter) {
            const searchInput = document.getElementById('insurance-search');
            const insuranceCards = document.querySelectorAll('.insurance-card');
            const insuranceFilterButtons = insuranceFilter.querySelectorAll('.filter-btn');

            // Search functionality
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase().trim();

                    insuranceCards.forEach(card => {
                        const cardText = card.textContent.toLowerCase();

                        if (searchTerm === '' || cardText.includes(searchTerm)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Reset active filter button
                    insuranceFilterButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });

                    // Set "All Plans" button as active
                    const allButton = insuranceFilter.querySelector('.filter-btn[data-category="all"]');
                    if (allButton) {
                        allButton.classList.add('active');
                    }
                });
            }

            // Category filter functionality for insurance
            insuranceFilterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');

                    // Update active button
                    insuranceFilterButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Filter insurance cards
                    insuranceCards.forEach(card => {
                        if (category === 'all' || card.getAttribute('data-category').includes(category)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Clear search input
                    if (searchInput) {
                        searchInput.value = '';
                    }
                });
            });
        }

        // Handle gallery filter
        if (galleryFilter) {
            const galleryFilterButtons = galleryFilter.querySelectorAll('.filter-btn');

            // Initialize gallery items with transition properties
            galleryItems.forEach(item => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });

            // Category filter functionality for gallery
            galleryFilterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');

                    // Update active button
                    galleryFilterButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Filter gallery items with animation
                    galleryItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');

                        if (category === 'all' || itemCategory === category) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }

    /**
     * Service Tabs
     */
    function initServiceTabs() {
        const tabsNavigation = document.querySelector('.tabs-navigation');

        if (tabsNavigation) {
            const tabButtons = tabsNavigation.querySelectorAll('.tab-btn');

            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    const tabPanel = document.getElementById(`${tabId}-panel`);

                    // Update active button
                    tabButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Update active panel
                    document.querySelectorAll('.tab-panel').forEach(panel => {
                        panel.classList.remove('active');
                    });

                    if (tabPanel) {
                        tabPanel.classList.add('active');
                    }
                });
            });
        }
    }

    /**
     * Service Modal
     */
    function initServiceModal() {
        const serviceButtons = document.querySelectorAll('.service-card-btn');
        const modal = document.getElementById('service-modal');

        if (serviceButtons.length > 0 && modal) {
            const modalContent = document.getElementById('modal-content-container');
            const modalClose = modal.querySelector('.modal-close');

            // Service details content
            const serviceDetails = {
                'vaccinations': {
                    title: 'Vaccinations',
                    content: `
                        <h2>Vaccination Services</h2>
                        <p>Our comprehensive vaccination services help protect you and your family from preventable diseases. We offer a wide range of vaccines for all age groups.</p>
                        <h3>Available Vaccines</h3>
                        <ul>
                            <li><strong>Flu Vaccines:</strong> Annual protection against influenza</li>
                            <li><strong>Tetanus/Tdap:</strong> Protection against tetanus, diphtheria, and pertussis</li>
                            <li><strong>Pneumonia:</strong> Protection against pneumococcal disease</li>
                            <li><strong>Shingles:</strong> Protection against shingles for adults 50+</li>
                            <li><strong>Hepatitis A & B:</strong> Protection against hepatitis infections</li>
                            <li><strong>MMR:</strong> Protection against measles, mumps, and rubella</li>
                        </ul>
                        <h3>What to Expect</h3>
                        <p>Our vaccination process is quick and convenient. A healthcare provider will review your medical history, answer any questions, and administer the vaccine. Most appointments take less than 30 minutes.</p>
                        <p>No appointment is necessary for most vaccinations, but you can save your spot online to reduce your wait time.</p>
                        <div class="modal-cta">
                            <a href="/save-your-spot" class="btn btn-primary">Save Your Spot</a>
                        </div>
                    `
                },
                'physicals': {
                    title: 'Physical Exams',
                    content: `
                        <h2>Physical Examination Services</h2>
                        <p>Our comprehensive physical exams help assess your overall health and identify potential health concerns before they become serious.</p>
                        <h3>Types of Physical Exams</h3>
                        <ul>
                            <li><strong>Annual Check-ups:</strong> Comprehensive health assessment</li>
                            <li><strong>Sports Physicals:</strong> Required for participation in sports activities</li>
                            <li><strong>School Physicals:</strong> Required for school enrollment</li>
                            <li><strong>Camp Physicals:</strong> Required for camp attendance</li>
                            <li><strong>Employment Physicals:</strong> Required for certain jobs</li>
                        </ul>
                        <h3>What to Expect</h3>
                        <p>During your physical exam, our healthcare provider will:</p>
                        <ul>
                            <li>Review your medical history</li>
                            <li>Check your vital signs (blood pressure, heart rate, temperature)</li>
                            <li>Perform a physical assessment</li>
                            <li>Order any necessary lab tests</li>
                            <li>Provide recommendations for maintaining or improving your health</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/save-your-spot" class="btn btn-primary">Schedule a Physical</a>
                        </div>
                    `
                },
                'screenings': {
                    title: 'Health Screenings',
                    content: `
                        <h2>Health Screening Services</h2>
                        <p>Early detection is key to maintaining good health. Our screening services help identify potential health issues before they become serious problems.</p>
                        <h3>Available Screenings</h3>
                        <ul>
                            <li><strong>Blood Pressure:</strong> Screening for hypertension</li>
                            <li><strong>Cholesterol:</strong> Screening for high cholesterol levels</li>
                            <li><strong>Diabetes:</strong> Screening for high blood sugar levels</li>
                            <li><strong>Body Mass Index (BMI):</strong> Assessment of weight status</li>
                            <li><strong>Vision:</strong> Basic vision screening</li>
                            <li><strong>Hearing:</strong> Basic hearing screening</li>
                        </ul>
                        <h3>Benefits of Regular Screenings</h3>
                        <p>Regular health screenings can:</p>
                        <ul>
                            <li>Detect health problems early</li>
                            <li>Prevent complications from chronic conditions</li>
                            <li>Establish baseline measurements for future comparison</li>
                            <li>Provide peace of mind</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/save-your-spot" class="btn btn-primary">Schedule a Screening</a>
                        </div>
                    `
                },
                'lab-testing': {
                    title: 'Laboratory Testing',
                    content: `
                        <h2>Laboratory Testing Services</h2>
                        <p>Our on-site laboratory allows for quick and convenient testing, with results often available during your visit.</p>
                        <h3>Available Tests</h3>
                        <ul>
                            <li><strong>Blood Work:</strong> Complete blood count, metabolic panels, lipid panels, etc.</li>
                            <li><strong>Urinalysis:</strong> Testing for urinary tract infections and other conditions</li>
                            <li><strong>Strep Tests:</strong> Rapid testing for strep throat</li>
                            <li><strong>Flu Tests:</strong> Rapid testing for influenza</li>
                            <li><strong>COVID-19 Tests:</strong> Testing for coronavirus</li>
                            <li><strong>Pregnancy Tests:</strong> Confirmation of pregnancy</li>
                            <li><strong>STI Tests:</strong> Testing for sexually transmitted infections</li>
                        </ul>
                        <h3>Benefits of On-Site Testing</h3>
                        <p>Having laboratory services available in our office means:</p>
                        <ul>
                            <li>Less time waiting for results</li>
                            <li>Faster diagnosis and treatment</li>
                            <li>One-stop convenience</li>
                            <li>No need to schedule separate appointments</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/save-your-spot" class="btn btn-primary">Schedule Lab Testing</a>
                        </div>
                    `
                },
                'x-ray': {
                    title: 'X-Ray Services',
                    content: `
                        <h2>X-Ray Services</h2>
                        <p>Our digital X-ray services provide clear images to help diagnose fractures, sprains, and other conditions. Results are available quickly, allowing for prompt treatment.</p>
                        <h3>Common X-Ray Applications</h3>
                        <ul>
                            <li><strong>Bone Fractures:</strong> Identifying broken bones</li>
                            <li><strong>Joint Injuries:</strong> Assessing damage to joints</li>
                            <li><strong>Chest X-rays:</strong> Examining the lungs, heart, and chest wall</li>
                            <li><strong>Abdominal X-rays:</strong> Examining the abdomen for issues</li>
                        </ul>
                        <h3>Benefits of Digital X-Ray</h3>
                        <p>Our digital X-ray technology offers several advantages:</p>
                        <ul>
                            <li>Lower radiation exposure than traditional X-rays</li>
                            <li>Higher quality images for better diagnosis</li>
                            <li>Immediate image availability</li>
                            <li>Easy sharing with specialists if needed</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/save-your-spot" class="btn btn-primary">Save Your Spot</a>
                        </div>
                    `
                },
                'ekg': {
                    title: 'EKG Testing',
                    content: `
                        <h2>EKG Testing Services</h2>
                        <p>Electrocardiogram (EKG) testing helps evaluate heart health by measuring electrical activity. This non-invasive test is quick and provides valuable information about heart function.</p>
                        <h3>When EKG Testing is Recommended</h3>
                        <ul>
                            <li>Chest pain or discomfort</li>
                            <li>Shortness of breath</li>
                            <li>Palpitations or irregular heartbeat</li>
                            <li>Pre-operative evaluation</li>
                            <li>Monitoring of heart conditions</li>
                            <li>Routine check-ups for patients with heart disease risk factors</li>
                        </ul>
                        <h3>What to Expect</h3>
                        <p>During an EKG test:</p>
                        <ul>
                            <li>Small, painless electrodes are placed on your chest, arms, and legs</li>
                            <li>The electrodes detect electrical signals from your heart</li>
                            <li>The test takes only a few minutes</li>
                            <li>Results are often available immediately</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/save-your-spot" class="btn btn-primary">Schedule an EKG</a>
                        </div>
                    `
                },
                'travel-medicine': {
                    title: 'Travel Medicine',
                    content: `
                        <h2>Travel Medicine Services</h2>
                        <p>Planning an international trip? Our travel medicine services help ensure you stay healthy while traveling abroad.</p>
                        <h3>Our Services Include</h3>
                        <ul>
                            <li><strong>Pre-Travel Consultations:</strong> Personalized advice based on your destination and health status</li>
                            <li><strong>Travel Vaccinations:</strong> Recommended or required vaccines for your destination</li>
                            <li><strong>Preventive Medications:</strong> Prescriptions for malaria prevention and traveler's diarrhea</li>
                            <li><strong>Travel Health Kits:</strong> Recommendations for essential items to pack</li>
                            <li><strong>Post-Travel Evaluations:</strong> Assessment if you become ill after returning home</li>
                        </ul>
                        <h3>When to Schedule</h3>
                        <p>Ideally, schedule your travel medicine consultation 4-6 weeks before your trip to allow time for:</p>
                        <ul>
                            <li>Vaccines to become effective</li>
                            <li>Multiple doses of vaccines if needed</li>
                            <li>Addressing any vaccine side effects before travel</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/save-your-spot" class="btn btn-primary">Schedule a Consultation</a>
                        </div>
                    `
                },
                'pre-employment': {
                    title: 'Pre-Employment Physicals',
                    content: `
                        <h2>Pre-Employment Physical Services</h2>
                        <p>Our pre-employment physicals help ensure that employees are physically capable of performing their job duties safely. These exams can be customized to meet your company's specific requirements.</p>
                        <h3>Components of Pre-Employment Physicals</h3>
                        <ul>
                            <li><strong>Medical History Review:</strong> Assessment of past and current health conditions</li>
                            <li><strong>Physical Examination:</strong> Evaluation of overall health status</li>
                            <li><strong>Vital Signs:</strong> Blood pressure, heart rate, temperature, etc.</li>
                            <li><strong>Vision and Hearing Tests:</strong> Basic screening of sensory functions</li>
                            <li><strong>Range of Motion Assessment:</strong> Evaluation of physical capabilities</li>
                            <li><strong>Drug Testing:</strong> If required by the employer</li>
                        </ul>
                        <h3>Benefits for Employers</h3>
                        <p>Pre-employment physicals can help:</p>
                        <ul>
                            <li>Ensure job candidates can safely perform required duties</li>
                            <li>Reduce workplace injuries and workers' compensation claims</li>
                            <li>Establish baseline health information for future reference</li>
                            <li>Comply with industry regulations and requirements</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/contact" class="btn btn-primary">Contact Us for Business Services</a>
                        </div>
                    `
                },
                'drug-testing': {
                    title: 'Drug Testing',
                    content: `
                        <h2>Drug Testing Services</h2>
                        <p>We offer comprehensive drug testing services for pre-employment screening, random testing, post-accident testing, and reasonable suspicion testing. Our processes ensure accurate results and confidentiality.</p>
                        <h3>Types of Drug Tests</h3>
                        <ul>
                            <li><strong>Urine Drug Tests:</strong> Most common type of drug screening</li>
                            <li><strong>Breath Alcohol Tests:</strong> Testing for alcohol consumption</li>
                            <li><strong>Hair Follicle Tests:</strong> Detects drug use over a longer period</li>
                            <li><strong>Saliva Tests:</strong> Less invasive option for drug screening</li>
                        </ul>
                        <h3>Testing Protocols</h3>
                        <p>Our drug testing services follow strict protocols to ensure accuracy and compliance:</p>
                        <ul>
                            <li>Chain of custody documentation</li>
                            <li>Certified collection procedures</li>
                            <li>Laboratory analysis by certified labs</li>
                            <li>Medical review officer (MRO) verification of results</li>
                            <li>Confidential reporting to authorized parties</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/contact" class="btn btn-primary">Contact Us for Business Services</a>
                        </div>
                    `
                },
                'workers-comp': {
                    title: 'Workers\' Compensation',
                    content: `
                        <h2>Workers' Compensation Services</h2>
                        <p>We provide prompt, efficient care for work-related injuries, helping employees recover and return to work safely. Our services include injury treatment, follow-up care, and required documentation.</p>
                        <h3>Our Workers' Comp Services</h3>
                        <ul>
                            <li><strong>Injury Evaluation and Treatment:</strong> Prompt care for workplace injuries</li>
                            <li><strong>Follow-up Care:</strong> Ongoing treatment and monitoring</li>
                            <li><strong>Return to Work Evaluations:</strong> Assessment of readiness to return to work</li>
                            <li><strong>Work Restrictions:</strong> Clear documentation of any limitations</li>
                            <li><strong>Communication:</strong> Regular updates to employers and insurance carriers</li>
                            <li><strong>Documentation:</strong> Comprehensive records for workers' compensation claims</li>
                        </ul>
                        <h3>Benefits of Our Workers' Comp Program</h3>
                        <p>Our workers' compensation services offer several advantages:</p>
                        <ul>
                            <li>Minimal wait times for injured workers</li>
                            <li>Comprehensive care from experienced providers</li>
                            <li>Efficient communication with all parties</li>
                            <li>Focus on safe and timely return to work</li>
                            <li>Complete and accurate documentation</li>
                        </ul>
                        <div class="modal-cta">
                            <a href="/contact" class="btn btn-primary">Contact Us for Business Services</a>
                        </div>
                    `
                }
            };

            // Open modal when service button is clicked
            serviceButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();

                    const serviceId = this.getAttribute('data-service');
                    const serviceDetail = serviceDetails[serviceId];

                    if (serviceDetail) {
                        modalContent.innerHTML = serviceDetail.content;
                        modal.style.display = 'block';

                        // Prevent body scrolling when modal is open
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            // Close modal when close button is clicked
            if (modalClose) {
                modalClose.addEventListener('click', function() {
                    modal.style.display = 'none';

                    // Restore body scrolling
                    document.body.style.overflow = '';
                });
            }

            // Close modal when clicking outside the content
            window.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';

                    // Restore body scrolling
                    document.body.style.overflow = '';
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    modal.style.display = 'none';

                    // Restore body scrolling
                    document.body.style.overflow = '';
                }
            });
        }
    }

    /**
     * Service Comparison
     */
    function initServiceComparison() {
        const comparisonContainer = document.querySelector('.comparison-container');

        if (comparisonContainer) {
            const checkboxes = comparisonContainer.querySelectorAll('input[name="compare-service"]');
            const serviceRows = document.querySelectorAll('.service-row');

            // Initialize comparison table based on checked boxes
            function updateComparisonTable() {
                const checkedServices = Array.from(checkboxes)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                serviceRows.forEach(row => {
                    const serviceId = row.getAttribute('data-service');

                    if (checkedServices.includes(serviceId)) {
                        row.style.display = 'table-row';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }

            // Add event listeners to checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateComparisonTable);
            });

            // Initialize table on page load
            updateComparisonTable();
        }
    }

    /**
     * Parallax Effect for Hero and Section Backgrounds
     */
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');

        if (parallaxElements.length > 0) {
            // Function to update parallax position
            function updateParallax() {
                parallaxElements.forEach(element => {
                    const scrollPosition = window.pageYOffset;
                    const elementTop = element.getBoundingClientRect().top + scrollPosition;
                    const elementVisible = elementTop - window.innerHeight;

                    if (scrollPosition > elementVisible) {
                        const speed = element.getAttribute('data-parallax-speed') || 0.3;
                        const yPos = (scrollPosition - elementTop) * speed;
                        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                    }
                });
            }

            // Add parallax effect to hero section if it exists
            const heroSection = document.querySelector('.hero');
            if (heroSection && !heroSection.classList.contains('parallax-bg')) {
                heroSection.classList.add('parallax-bg');
                heroSection.setAttribute('data-parallax-speed', '0.4');
            }

            // Listen for scroll events
            window.addEventListener('scroll', updateParallax);

            // Initial update
            updateParallax();
        }
    }

    /**
     * Counter Animation for Statistics
     */
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.counter');

        if (counters.length > 0) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'), 10);
                        const duration = parseInt(counter.getAttribute('data-duration') || 2000, 10);
                        const increment = target / (duration / 16); // 60fps

                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.ceil(current).toLocaleString();
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target.toLocaleString();
                            }
                        };

                        updateCounter();
                        observer.unobserve(counter);
                    }
                });
            }, options);

            counters.forEach(counter => {
                observer.observe(counter);
            });
        }
    }

    /**
     * Image Lightbox for Gallery Images
     */
    function initImageLightbox() {
        const galleryImages = document.querySelectorAll('.gallery-image');

        if (galleryImages.length > 0) {
            // Create lightbox elements if they don't exist
            let lightbox = document.querySelector('.image-lightbox');
            if (!lightbox) {
                lightbox = document.createElement('div');
                lightbox.className = 'image-lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                        <button class="lightbox-prev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
                        <button class="lightbox-next" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
                        <div class="lightbox-image-container">
                            <img src="" alt="" class="lightbox-image">
                        </div>
                        <div class="lightbox-caption"></div>
                    </div>
                `;
                document.body.appendChild(lightbox);
            }

            const lightboxImage = lightbox.querySelector('.lightbox-image');
            const lightboxCaption = lightbox.querySelector('.lightbox-caption');
            const lightboxClose = lightbox.querySelector('.lightbox-close');
            const lightboxPrev = lightbox.querySelector('.lightbox-prev');
            const lightboxNext = lightbox.querySelector('.lightbox-next');

            let currentIndex = 0;

            // Open lightbox when clicking on gallery image
            galleryImages.forEach((image, index) => {
                image.addEventListener('click', function(e) {
                    e.preventDefault();

                    currentIndex = index;
                    updateLightbox();
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            // Update lightbox content
            function updateLightbox() {
                const currentImage = galleryImages[currentIndex];
                const fullSrc = currentImage.getAttribute('data-full-src') || currentImage.src;
                const caption = currentImage.getAttribute('data-caption') || '';

                lightboxImage.src = fullSrc;
                lightboxCaption.textContent = caption;

                // Update navigation buttons visibility
                lightboxPrev.style.display = currentIndex > 0 ? 'block' : 'none';
                lightboxNext.style.display = currentIndex < galleryImages.length - 1 ? 'block' : 'none';
            }

            // Navigation functions
            function prevImage() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateLightbox();
                }
            }

            function nextImage() {
                if (currentIndex < galleryImages.length - 1) {
                    currentIndex++;
                    updateLightbox();
                }
            }

            // Close lightbox
            function closeLightbox() {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Event listeners
            lightboxClose.addEventListener('click', closeLightbox);
            lightboxPrev.addEventListener('click', prevImage);
            lightboxNext.addEventListener('click', nextImage);

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (lightbox.classList.contains('active')) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                    } else if (e.key === 'ArrowLeft') {
                        prevImage();
                    } else if (e.key === 'ArrowRight') {
                        nextImage();
                    }
                }
            });

            // Close when clicking outside the image
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
    }

    /**
     * Initialize CTA section enhancements
     */
    function initCtaEnhancements() {
        const ctaSection = document.querySelector('.cta-enhanced');
        if (!ctaSection) return;

        // Add hover effect to CTA features
        const ctaFeatures = ctaSection.querySelectorAll('.cta-feature');
        ctaFeatures.forEach(feature => {
            feature.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });

            feature.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Add pulse animation to buttons
        const ctaButtons = ctaSection.querySelectorAll('.btn');
        ctaButtons.forEach(button => {
            button.classList.add('hover-scale');
        });
    }

    /**
     * Advanced Animations with GSAP-like Effects - Modified to exclude contact cards
     */
    function initAdvancedAnimations() {
        // Add staggered entrance animations to sections
        const sections = document.querySelectorAll('section');

        if (sections.length > 0 && 'IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        // Exclude contact-option elements from animations
                        const elements = section.querySelectorAll('.animate-stagger:not(.contact-option)');

                        elements.forEach((el, index) => {
                            // Skip contact-option elements
                            if (!el.classList.contains('contact-option')) {
                                setTimeout(() => {
                                    el.classList.add('animated');
                                }, 100 * index);
                            }
                        });

                        sectionObserver.unobserve(section);
                    }
                });
            }, {
                root: null,
                rootMargin: '-10% 0px',
                threshold: 0.1
            });

            sections.forEach(section => {
                // Add stagger class to child elements, excluding contact-option
                const childElements = section.querySelectorAll('h2, h3, p, .btn, .card, .feature-card');
                childElements.forEach(el => {
                    // Skip contact-option elements and their children
                    if (!el.classList.contains('animate-on-scroll') &&
                        !el.classList.contains('contact-option') &&
                        !el.closest('.contact-option')) {
                        el.classList.add('animate-stagger');
                    }
                });

                sectionObserver.observe(section);
            });
        }

        // Add hover animations to buttons and cards, excluding contact-option
        const hoverElements = document.querySelectorAll('.btn:not(.contact-option .btn), .card:not(.contact-option), .service-card:not(.contact-option), .feature-card:not(.contact-option)');
        hoverElements.forEach(element => {
            // Skip contact-option elements and their children
            if (!element.closest('.contact-option')) {
                element.addEventListener('mouseenter', function() {
                    this.classList.add('hover-active');
                });

                element.addEventListener('mouseleave', function() {
                    this.classList.remove('hover-active');
                });
            }
        });

        // Add scroll-triggered animations to specific elements
        const scrollTriggers = document.querySelectorAll('.scroll-trigger');
        if (scrollTriggers.length > 0 && 'IntersectionObserver' in window) {
            const triggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.getAttribute('data-animation') || 'fade-in';

                        element.classList.add(animation);
                        element.classList.add('animated');

                        triggerObserver.unobserve(element);
                    }
                });
            }, {
                root: null,
                rootMargin: '-20% 0px',
                threshold: 0
            });

            scrollTriggers.forEach(trigger => {
                triggerObserver.observe(trigger);
            });
        }
    }

    /**
     * Accessibility Features
     */
    function initAccessibilityFeatures() {
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add aria-current to current page in navigation
        const currentMenuItem = document.querySelector('.current-menu-item a');
        if (currentMenuItem) {
            currentMenuItem.setAttribute('aria-current', 'page');
        }

        // Ensure all interactive elements have appropriate roles and states
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
                const icon = button.querySelector('i');
                if (icon) {
                    const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
                    if (iconClass) {
                        const label = iconClass.replace('fa-', '').replace(/-/g, ' ');
                        button.setAttribute('aria-label', label);
                    }
                }
            }
        });

        // Add focus styles
        const style = document.createElement('style');
        style.textContent = `
            :focus-visible {
                outline: 3px solid var(--primary-green);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        // Add keyboard navigation for custom components
        const customComponents = document.querySelectorAll('.tabs-navigation, .filter-categories');
        customComponents.forEach(component => {
            const interactiveElements = component.querySelectorAll('button, a');

            interactiveElements.forEach((element, index) => {
                element.setAttribute('tabindex', '0');

                element.addEventListener('keydown', function(e) {
                    let nextElement;

                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        nextElement = interactiveElements[index + 1] || interactiveElements[0];
                        e.preventDefault();
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        nextElement = interactiveElements[index - 1] || interactiveElements[interactiveElements.length - 1];
                        e.preventDefault();
                    }

                    if (nextElement) {
                        nextElement.focus();
                    }
                });
            });
        });
    }

    /**
     * About Page Specific Animations
     */
    function initAboutPageAnimations() {
        // Only run on about page
        if (!document.body.classList.contains('about-page') && !window.location.pathname.includes('about')) {
            return;
        }

        // Initialize slide-in animations
        const slideInElements = document.querySelectorAll('.slide-in-left, .slide-in-right');

        if (slideInElements.length > 0 && 'IntersectionObserver' in window) {
            const slideObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        slideObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '-10% 0px',
                threshold: 0.1
            });

            slideInElements.forEach(element => {
                element.style.animationPlayState = 'paused';
                slideObserver.observe(element);
            });
        }

        // Initialize stagger animations for value cards
        const staggerItems = document.querySelectorAll('.stagger-item');

        if (staggerItems.length > 0 && 'IntersectionObserver' in window) {
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || '0';
                        setTimeout(() => {
                            entry.target.style.animationPlayState = 'running';
                        }, parseFloat(delay) * 1000);
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '-10% 0px',
                threshold: 0.1
            });

            staggerItems.forEach(element => {
                element.style.animationPlayState = 'paused';
                staggerObserver.observe(element);
            });
        }

        // Initialize counter animation for stats
        const counters = document.querySelectorAll('.counter');

        if (counters.length > 0 && 'IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.dataset.count);
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16); // 60fps
                        let current = 0;

                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.floor(current).toLocaleString();
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target.toLocaleString();
                            }
                        };

                        updateCounter();
                        counterObserver.unobserve(counter);
                    }
                });
            }, {
                rootMargin: '-10% 0px',
                threshold: 0.1
            });

            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        }

        // Add hover effects for value cards
        const valueCards = document.querySelectorAll('.value-card');
        valueCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Initialize image zoom effects
        const zoomImages = document.querySelectorAll('.image-zoom');
        zoomImages.forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });

            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Patient Services Page Specific Animations
     */
    function initPatientServicesAnimations() {
        // Only run on patient services page
        if (!document.body.classList.contains('patient-services-page') && !window.location.pathname.includes('patient-services')) {
            return;
        }

        // Animate category cards on scroll
        const categoryCards = document.querySelectorAll('.category-card');

        if (categoryCards.length > 0 && 'IntersectionObserver' in window) {
            const categoryObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 150); // Stagger the animations
                        categoryObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '-10% 0px',
                threshold: 0.1
            });

            categoryCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                categoryObserver.observe(card);
            });
        }

        // Animate service items on scroll
        const serviceItems = document.querySelectorAll('.service-item');

        if (serviceItems.length > 0 && 'IntersectionObserver' in window) {
            const serviceObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, index * 100); // Stagger the animations
                        serviceObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '-5% 0px',
                threshold: 0.1
            });

            serviceItems.forEach((item, index) => {
                item.style.opacity = '0';
                // Alternate slide direction for visual interest
                item.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                serviceObserver.observe(item);
            });
        }

        // Animate CTA box
        const ctaBox = document.querySelector('.cta-box');

        if (ctaBox && 'IntersectionObserver' in window) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                        ctaObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '-10% 0px',
                threshold: 0.1
            });

            ctaBox.style.opacity = '0';
            ctaBox.style.transform = 'scale(0.95)';
            ctaBox.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            ctaObserver.observe(ctaBox);
        }

        // Enhanced hover effects for category cards
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.category-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });

            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.category-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Enhanced hover effects for service items
        serviceItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.05) rotate(-5deg)';
                }
            });

            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Smooth scroll to services section when category card is clicked
        categoryCards.forEach(card => {
            const link = card.querySelector('a[href*=".html"]');
            if (link) {
                card.addEventListener('click', function(e) {
                    // Add a subtle click animation
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            }
        });

        // Add loading animation for buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add loading state for external links
                if (this.href && !this.href.includes('#')) {
                    this.style.opacity = '0.7';
                    this.style.pointerEvents = 'none';

                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';

                    // Reset after a short delay (in case navigation is slow)
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.opacity = '';
                        this.style.pointerEvents = '';
                    }, 3000);
                }
            });
        });
    }
})();

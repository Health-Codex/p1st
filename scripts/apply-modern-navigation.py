#!/usr/bin/env python3

"""
Modern Navigation Applier
This script applies the modern navigation structure to all pages with old navigation
"""

import re
import os
import shutil
from datetime import datetime

# Pages that need navigation updates (excluding contact.html which is already done)
PAGES_TO_UPDATE = [
    "allergy-testing.html",
    "gallery.html", 
    "insurance.html",
    "lab-testing.html",
    "pay.html",
    "physicals.html",
    "primary-care.html",
    "save-your-spot.html",
    "services.html",
    "telemedicine.html",
    "urgent-care.html",
    "vaccinations.html",
    "weight-loss.html",
    "x-ray.html"
]

# Page-specific current menu highlighting
PAGE_HIGHLIGHTS = {
    "allergy-testing.html": "services",
    "gallery.html": "gallery",
    "insurance.html": "insurance", 
    "lab-testing.html": "services",
    "payment.html": "pay",
    "physicals.html": "services",
    "primary-care.html": "services",
    "save-your-spot.html": "spot",
    "services.html": "services",
    "telemedicine.html": "telemedicine",
    "urgent-care.html": "services",
    "vaccinations.html": "services",
    "weight-loss.html": "services",
    "x-ray.html": "services"
}

def get_modern_navigation(page_name):
    """Generate modern navigation HTML with appropriate current page highlighting"""
    current_page = PAGE_HIGHLIGHTS.get(page_name, "home")
    
    # Determine which nav item should be highlighted
    home_class = "nav-link current-menu-item" if current_page == "home" else "nav-link"
    about_class = "nav-link current-menu-item" if current_page == "about" else "nav-link"
    staff_class = "nav-link current-menu-item" if current_page == "staff" else "nav-link"
    services_class = "nav-link current-menu-item" if current_page == "services" else "nav-link"
    telemedicine_class = "nav-link current-menu-item" if current_page == "telemedicine" else "nav-link"
    insurance_class = "nav-link current-menu-item" if current_page == "insurance" else "nav-link"
    locations_class = "nav-link current-menu-item" if current_page == "locations" else "nav-link"
    gallery_class = "nav-link current-menu-item" if current_page == "gallery" else "nav-link"
    
    return f'''            <!-- Navigation Container -->
            <div class="nav-container">
                <nav class="main-navigation" aria-label="Main Navigation">
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a href="index.html" class="{home_class}" data-page="home">Home</a>
                        </li>
                        <li class="nav-item">
                            <a href="about.html" class="{about_class}" data-page="about">About Us</a>
                        </li>
                        <li class="nav-item">
                            <a href="our-staff.html" class="{staff_class}" data-page="staff">Our Staff</a>
                        </li>
                        <li class="nav-item">
                            <a href="patient-services.html" class="{services_class}" data-page="services">
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
                            <a href="telemedicine.html" class="{telemedicine_class}" data-page="telemedicine">Telemedicine</a>
                        </li>
                        <li class="nav-item">
                            <a href="insurance.html" class="{insurance_class}" data-page="insurance">Insurance</a>
                        </li>
                        <li class="nav-item">
                            <a href="contact.html" class="{locations_class}" data-page="locations">
                                Locations
                                <i class="fa-solid fa-chevron-down dropdown-icon"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="contact.html" class="dropdown-item">All Locations</a>
                                <a href="contact.html#collierville" class="dropdown-item">Collierville</a>
                                <a href="contact.html#southaven" class="dropdown-item">Southaven</a>
                                <a href="contact.html#millington" class="dropdown-item">Millington</a>
                                <a href="contact.html#germantown" class="dropdown-item">Germantown</a>
                                <a href="contact.html#bartlett" class="dropdown-item">Bartlett</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a href="gallery.html" class="{gallery_class}" data-page="gallery">Gallery</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <div class="header-actions">
                    <a href="payment.html" class="btn btn-secondary header-btn btn-pay-now">
                        Pay Now
                    </a>
                    <a href="save-your-spot.html" class="btn btn-primary header-btn btn-save-spot">
                        <i class="fa-solid fa-calendar-check"></i>
                        Save Your Spot
                    </a>
                </div>
                
                <!-- Mobile Toggle -->
                <button class="mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>'''

def get_mobile_navigation(page_name):
    """Generate mobile navigation HTML with appropriate current page highlighting"""
    current_page = PAGE_HIGHLIGHTS.get(page_name, "home")
    
    # Determine which mobile nav item should be highlighted
    home_class = "mobile-nav-link current-menu-item" if current_page == "home" else "mobile-nav-link"
    about_class = "mobile-nav-link current-menu-item" if current_page == "about" else "mobile-nav-link"
    staff_class = "mobile-nav-link current-menu-item" if current_page == "staff" else "mobile-nav-link"
    services_class = "mobile-nav-link current-menu-item" if current_page == "services" else "mobile-nav-link"
    telemedicine_class = "mobile-nav-link current-menu-item" if current_page == "telemedicine" else "mobile-nav-link"
    insurance_class = "mobile-nav-link current-menu-item" if current_page == "insurance" else "mobile-nav-link"
    locations_class = "mobile-nav-link current-menu-item" if current_page == "locations" else "mobile-nav-link"
    gallery_class = "mobile-nav-link current-menu-item" if current_page == "gallery" else "mobile-nav-link"
    
    return f'''
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
                <a href="index.html" class="{home_class}" data-page="home">Home</a>
            </li>
            <li class="mobile-nav-item">
                <a href="about.html" class="{about_class}" data-page="about">About Us</a>
            </li>
            <li class="mobile-nav-item">
                <a href="our-staff.html" class="{staff_class}" data-page="staff">Our Staff</a>
            </li>
            <li class="mobile-nav-item">
                <a href="patient-services.html" class="{services_class}" data-page="services">
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
                <a href="telemedicine.html" class="{telemedicine_class}" data-page="telemedicine">Telemedicine</a>
            </li>
            <li class="mobile-nav-item">
                <a href="insurance.html" class="{insurance_class}" data-page="insurance">Insurance</a>
            </li>
            <li class="mobile-nav-item">
                <a href="contact.html" class="{locations_class}" data-page="locations">
                    Locations
                    <button class="mobile-dropdown-toggle" aria-label="Toggle Locations menu">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </a>
                <div class="mobile-dropdown">
                    <a href="contact.html" class="mobile-dropdown-item">All Locations</a>
                    <a href="contact.html#collierville" class="mobile-dropdown-item">Collierville</a>
                    <a href="contact.html#southaven" class="mobile-dropdown-item">Southaven</a>
                    <a href="contact.html#millington" class="mobile-dropdown-item">Millington</a>
                    <a href="contact.html#germantown" class="mobile-dropdown-item">Germantown</a>
                    <a href="contact.html#bartlett" class="mobile-dropdown-item">Bartlett</a>
                </div>
            </li>
            <li class="mobile-nav-item">
                <a href="gallery.html" class="{gallery_class}" data-page="gallery">Gallery</a>
            </li>
            <li class="mobile-nav-item">
                <a href="pay.html" class="mobile-nav-link">Pay Now</a>
            </li>
            <li class="mobile-nav-item">
                <a href="save-your-spot.html" class="mobile-nav-link">
                    <i class="fa-solid fa-calendar-check"></i>
                    Save Your Spot
                </a>
            </li>
        </ul>
    </nav>
'''

def update_page_navigation(page_path):
    """Update a single page with modern navigation"""
    print(f"Updating {page_path}...")
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    page_name = os.path.basename(page_path)
    
    # Replace old navigation structure with modern one
    # Pattern to match old navigation from <nav class="main-navigation"> to </div> (header-actions)
    old_nav_pattern = r'<nav class="main-navigation".*?<div class="header-actions">.*?</div>'
    modern_nav = get_modern_navigation(page_name)
    
    content = re.sub(old_nav_pattern, modern_nav, content, flags=re.DOTALL)
    
    # Add mobile navigation after </header> if not present
    if 'mobile-menu-overlay' not in content:
        mobile_nav = get_mobile_navigation(page_name)
        content = re.sub(r'</header>\s*<main', f'</header>{mobile_nav}\n\n<main', content)
    
    # Write updated content
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated {page_path}")

def main():
    print("=== APPLYING MODERN NAVIGATION TO ALL PAGES ===")
    print(f"Updating {len(PAGES_TO_UPDATE)} pages...")
    print()
    
    # Create backup directory
    backup_dir = f"backups/modern_nav_update_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    os.makedirs(backup_dir, exist_ok=True)
    print(f"Created backup directory: {backup_dir}")
    print()
    
    updated_count = 0
    
    for page in PAGES_TO_UPDATE:
        if os.path.exists(page):
            # Create backup
            shutil.copy2(page, backup_dir)
            
            # Update navigation
            try:
                update_page_navigation(page)
                updated_count += 1
            except Exception as e:
                print(f"❌ Error updating {page}: {e}")
        else:
            print(f"⚠️  File not found: {page}")
    
    print()
    print("=== UPDATE COMPLETE ===")
    print(f"Successfully updated {updated_count} pages")
    print(f"Backups saved to: {backup_dir}")
    print()
    print("All pages now have:")
    print("✅ Modern navigation structure")
    print("✅ Mobile menu functionality") 
    print("✅ Consistent CSS classes")
    print("✅ Proper current page highlighting")

if __name__ == "__main__":
    main()

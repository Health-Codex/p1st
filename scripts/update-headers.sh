#!/bin/bash

# Header System Update Script
# Updates all HTML files with the new header system

echo "🚀 Starting header system update for all pages..."

# List of main HTML files to update
HTML_FILES=(
    "about.html"
    "contact.html"
    "gallery.html"
    "insurance.html"
    "lab-testing.html"
    "our-staff.html"
    "patient-services.html"
    "pay.html"
    "physicals.html"
    "primary-care.html"
    "save-your-spot.html"
    "services.html"
    "telemedicine.html"
    "urgent-care.html"
    "vaccinations.html"
    "weight-loss.html"
    "x-ray.html"
)

# Backup directory
BACKUP_DIR="backups/header-update-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Creating backups in $BACKUP_DIR..."

# Function to update a single HTML file
update_html_file() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        echo "⚠️  File not found: $file"
        return 1
    fi
    
    echo "🔄 Updating $file..."
    
    # Create backup
    cp "$file" "$BACKUP_DIR/"
    
    # Create temporary file for processing
    local temp_file="${file}.tmp"
    
    # Extract the content after the header section
    # Look for the main content or first section after header
    local main_content_start=$(grep -n -E "(main|<section|<div class=\"hero|<div class=\"container)" "$file" | head -1 | cut -d: -f1)
    
    if [ -z "$main_content_start" ]; then
        echo "⚠️  Could not find main content start in $file"
        return 1
    fi
    
    # Create new file with updated header
    {
        # Copy everything up to the body tag
        sed -n '1,/<body>/p' "$file"
        
        # Insert new header system
        cat << 'EOF'
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="skip-to-content">Skip to content</a>

    <!-- Site Header -->
    <header class="site-header" id="site-header">
        <!-- Top Bar -->
        <div class="top-bar">
            <div class="top-bar-container">
                <div class="top-bar-content">
                    <div class="top-bar-info">
                        <span>Questions? <a href="tel:901-473-0582">901-473-0582</a></span>
                        <span><a href="mailto:info@peoplefirstcare.com">info@peoplefirstcare.com</a></span>
                    </div>
                </div>
            </div>
        </div>

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

                <!-- Navigation Container -->
                <div class="nav-container">
                    <nav class="main-navigation" aria-label="Main Navigation">
                        <ul class="nav-menu">
                            <li class="nav-item">
                                <a href="index.html" class="nav-link" data-page="home">Home</a>
                            </li>
                            <li class="nav-item">
                                <a href="about.html" class="nav-link" data-page="about">About Us</a>
                            </li>
                            <li class="nav-item">
                                <a href="our-staff.html" class="nav-link" data-page="staff">Our Staff</a>
                            </li>
                            <li class="nav-item">
                                <a href="patient-services.html" class="nav-link" data-page="services">
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
                                <a href="telemedicine.html" class="nav-link" data-page="telemedicine">Telemedicine</a>
                            </li>
                            <li class="nav-item">
                                <a href="insurance.html" class="nav-link" data-page="insurance">Insurance</a>
                            </li>
                            <li class="nav-item">
                                <a href="contact.html" class="nav-link" data-page="locations">
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
                                <a href="gallery.html" class="nav-link" data-page="gallery">Gallery</a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <div class="header-actions">
                        <a href="pay.html" class="btn btn-secondary header-btn btn-pay-now">
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
                </div>
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
                    <a href="contact.html#millington" class="mobile-dropdown-item">Millington</a>
                    <a href="contact.html#germantown" class="mobile-dropdown-item">Germantown</a>
                    <a href="contact.html#bartlett" class="mobile-dropdown-item">Bartlett</a>
                </div>
            </li>
            <li class="mobile-nav-item">
                <a href="gallery.html" class="mobile-nav-link" data-page="gallery">Gallery</a>
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

EOF
        
        # Copy the rest of the file starting from main content
        tail -n +$main_content_start "$file"
        
    } > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$file"
    
    echo "✅ Updated $file successfully"
}

# Update CSS references in all files
update_css_references() {
    echo "🎨 Updating CSS references..."
    
    for file in "${HTML_FILES[@]}"; do
        if [ -f "$file" ]; then
            # Add the new header system CSS if not already present
            if ! grep -q "header-system-complete.css" "$file"; then
                sed -i.bak 's|</head>|    <link rel="stylesheet" href="assets/css/header-system-complete.css">\n</head>|' "$file"
                rm -f "${file}.bak"
                echo "✅ Added header CSS to $file"
            fi
        fi
    done
}

# Update JavaScript references
update_js_references() {
    echo "📜 Updating JavaScript references..."
    
    for file in "${HTML_FILES[@]}"; do
        if [ -f "$file" ]; then
            # Update header system JS reference
            sed -i.bak 's|assets/js/header-system.js|assets/js/core/header-system-new.js|g' "$file"
            rm -f "${file}.bak"
            echo "✅ Updated JS reference in $file"
        fi
    done
}

# Main execution
echo "📋 Files to update: ${HTML_FILES[*]}"
echo ""

# Update CSS and JS references first
update_css_references
update_js_references

# Update each HTML file
for file in "${HTML_FILES[@]}"; do
    update_html_file "$file"
done

echo ""
echo "🎉 Header system update completed!"
echo "📁 Backups saved in: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Test the updated pages"
echo "2. Verify mobile responsiveness"
echo "3. Check all navigation links"
echo "4. Validate HTML structure"

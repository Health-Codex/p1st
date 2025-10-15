#!/bin/bash

# Navigation Standardization Script
# This script updates all HTML pages to use the standardized navigation structure

echo "Starting navigation standardization process..."

# List of HTML files to update (excluding index.html which is already correct)
HTML_FILES=(
    "patient-services.html"
    "lab-testing.html"
    "x-ray.html"
    "vaccinations.html"
    "physicals.html"
    "urgent-care.html"
    "primary-care.html"
    "telemedicine.html"
    "insurance.html"
    "contact.html"
    "gallery.html"
    "pay.html"
    "save-your-spot.html"
    "services.html"
)

# Function to update JavaScript loading
update_javascript_loading() {
    local file="$1"
    echo "Updating JavaScript loading for $file..."
    
    # Create temporary file
    temp_file=$(mktemp)
    
    # Update JavaScript paths and add missing files
    sed -E '
        s|assets/js/custom\.js|assets/js/core/custom.js|g
        s|assets/js/main\.js|assets/js/core/main.js|g
        s|assets/js/mobile-enhancements\.js|assets/js/mobile/mobile-enhancements.js|g
        s|assets/js/header-system\.js|assets/js/core/header-system-new.js|g
        s|assets/js/advanced-interactions\.js||g
    ' "$file" > "$temp_file"
    
    # Add mobile-menu-fix.js if not present
    if ! grep -q "mobile-menu-fix.js" "$temp_file"; then
        sed -i '/mobile\/mobile-enhancements\.js/a\    <script src="assets/js/mobile/mobile-menu-fix.js"></script>' "$temp_file"
    fi
    
    mv "$temp_file" "$file"
}

# Function to get current page name for active menu highlighting
get_current_page() {
    local file="$1"
    case "$file" in
        "about.html") echo "about" ;;
        "our-staff.html") echo "staff" ;;
        "patient-services.html") echo "services" ;;
        "telemedicine.html") echo "telemedicine" ;;
        "insurance.html") echo "insurance" ;;
        "contact.html") echo "locations" ;;
        "gallery.html") echo "gallery" ;;
        *) echo "home" ;;
    esac
}

# Process each HTML file
for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "File $file not found, skipping..."
        continue
    fi
    
    echo "Processing $file..."
    
    # Update JavaScript loading
    update_javascript_loading "$file"
    
    echo "Updated $file"
done

echo "Navigation standardization complete!"
echo "Note: Manual verification recommended for complex pages."

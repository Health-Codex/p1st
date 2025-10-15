#!/bin/bash

# Complete Navigation Update Script
# This script completes the navigation standardization for all remaining pages

echo "Starting complete navigation update..."

# List of remaining HTML files to update
REMAINING_FILES=(
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

# Function to update JavaScript loading for a file
update_js_loading() {
    local file="$1"
    echo "Updating JavaScript loading for $file..."
    
    # Use sed to update JavaScript paths
    sed -i.bak '
        s|assets/js/custom\.js|assets/js/core/custom.js|g
        s|assets/js/main\.js|assets/js/core/main.js|g
        s|assets/js/mobile-enhancements\.js|assets/js/mobile/mobile-enhancements.js|g
        s|assets/js/header-system\.js|assets/js/core/header-system-new.js|g
        s|assets/js/mobile-optimizations\.js||g
        s|assets/js/advanced-interactions\.js||g
    ' "$file"
    
    # Add mobile-menu-fix.js if not present
    if ! grep -q "mobile-menu-fix.js" "$file"; then
        sed -i '' '/mobile\/mobile-enhancements\.js/a\
    <script src="assets/js/mobile/mobile-menu-fix.js"></script>
' "$file"
    fi
    
    # Remove backup file
    rm -f "${file}.bak"
}

# Function to clean up redundant files
cleanup_redundant_files() {
    echo "Cleaning up redundant files..."
    
    # Remove backup files
    find . -name "*.backup*" -type f -delete
    find . -name "*.bak" -type f -delete
    
    # Remove old index files
    if [ -f "index-old.html" ]; then
        rm "index-old.html"
        echo "Removed index-old.html"
    fi
    
    echo "Cleanup complete."
}

# Function to organize assets
organize_assets() {
    echo "Organizing asset structure..."
    
    # Ensure proper directory structure exists
    mkdir -p assets/templates/navigation
    mkdir -p assets/templates/scripts
    mkdir -p scripts/maintenance
    
    echo "Asset organization complete."
}

# Process each remaining file
for file in "${REMAINING_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "File $file not found, skipping..."
        continue
    fi
    
    echo "Processing $file..."
    update_js_loading "$file"
    echo "Updated JavaScript loading for $file"
done

# Perform cleanup and organization
cleanup_redundant_files
organize_assets

echo "Complete navigation update finished!"
echo ""
echo "Summary of changes:"
echo "- Updated JavaScript loading paths for ${#REMAINING_FILES[@]} files"
echo "- Cleaned up redundant backup files"
echo "- Organized asset directory structure"
echo ""
echo "Next steps:"
echo "1. Test navigation functionality on all pages"
echo "2. Verify mobile menu works correctly"
echo "3. Check responsive behavior across devices"

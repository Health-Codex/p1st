#!/bin/bash

# Fix Missing JavaScript Files
# This script adds the missing mobile-menu-fix.js to all pages that need it

echo "=== FIXING MISSING JAVASCRIPT FILES ==="
echo "Adding mobile-menu-fix.js to all pages that need it..."
echo ""

# Pages that need the mobile-menu-fix.js file added
PAGES_NEEDING_JS=(
    "allergy-testing.html"
    "contact.html"
    "gallery.html"
    "insurance.html"
    "lab-testing.html"
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

# Create backup directory
BACKUP_DIR="backups/js_fix_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"
echo ""

# Function to add missing JavaScript
add_missing_js() {
    local file="$1"
    echo "Processing $file..."
    
    # Create backup
    cp "$file" "$BACKUP_DIR/"
    
    # Check if mobile-menu-fix.js is already present
    if grep -q "mobile-menu-fix.js" "$file"; then
        echo "  ✅ mobile-menu-fix.js already present"
        return
    fi
    
    # Add mobile-menu-fix.js after mobile-enhancements.js
    if grep -q "mobile/mobile-enhancements.js" "$file"; then
        sed -i.tmp '/mobile\/mobile-enhancements\.js/a\
    <script src="assets/js/mobile/mobile-menu-fix.js"></script>' "$file"
        rm -f "${file}.tmp"
        echo "  ✅ Added mobile-menu-fix.js"
    else
        echo "  ❌ Could not find mobile-enhancements.js to insert after"
    fi
}

# Process each page
for page in "${PAGES_NEEDING_JS[@]}"; do
    if [ -f "$page" ]; then
        add_missing_js "$page"
    else
        echo "❌ File not found: $page"
    fi
done

echo ""
echo "=== JAVASCRIPT FIX COMPLETE ==="
echo "Processed ${#PAGES_NEEDING_JS[@]} pages"
echo "Backups saved to: $BACKUP_DIR"
echo ""
echo "Running verification to confirm fixes..."

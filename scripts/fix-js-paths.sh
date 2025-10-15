#!/bin/bash

# Fix JavaScript Paths
# This script corrects the mobile-menu-fix.js path in all files

echo "=== FIXING JAVASCRIPT PATHS ==="
echo "Correcting mobile-menu-fix.js paths..."
echo ""

# All main pages
ALL_PAGES=(
    "index.html"
    "about.html"
    "our-staff.html"
    "patient-services.html"
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
BACKUP_DIR="backups/js_path_fix_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"
echo ""

# Function to fix JavaScript paths
fix_js_paths() {
    local file="$1"
    echo "Processing $file..."
    
    # Create backup
    cp "$file" "$BACKUP_DIR/"
    
    # Fix the mobile-menu-fix.js path
    if grep -q 'src="assets/js/mobile-menu-fix.js"' "$file"; then
        sed -i.tmp 's|assets/js/mobile-menu-fix\.js|assets/js/mobile/mobile-menu-fix.js|g' "$file"
        rm -f "${file}.tmp"
        echo "  ✅ Fixed mobile-menu-fix.js path"
    elif grep -q 'src="assets/js/mobile/mobile-menu-fix.js"' "$file"; then
        echo "  ✅ Path already correct"
    else
        echo "  ⚠️  mobile-menu-fix.js not found"
    fi
}

# Process each page
for page in "${ALL_PAGES[@]}"; do
    if [ -f "$page" ]; then
        fix_js_paths "$page"
    else
        echo "❌ File not found: $page"
    fi
done

echo ""
echo "=== JAVASCRIPT PATH FIX COMPLETE ==="
echo "Processed ${#ALL_PAGES[@]} pages"
echo "Backups saved to: $BACKUP_DIR"

#!/bin/bash

# Complete Navigation Fix Script
# This script updates ALL pages with old navigation to the modern structure

echo "=== FIXING ALL NAVIGATION ISSUES ==="
echo "Updating all pages with old navigation structure..."
echo ""

# List of main pages that need navigation updates (from audit)
PAGES_TO_UPDATE=(
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
BACKUP_DIR="backups/complete_nav_fix_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"
echo ""

# Function to get current page identifier for highlighting
get_page_identifier() {
    local file="$1"
    case "$file" in
        "allergy-testing.html") echo "allergy" ;;
        "contact.html") echo "locations" ;;
        "gallery.html") echo "gallery" ;;
        "insurance.html") echo "insurance" ;;
        "lab-testing.html") echo "lab" ;;
        "pay.html") echo "pay" ;;
        "physicals.html") echo "physicals" ;;
        "primary-care.html") echo "primary" ;;
        "save-your-spot.html") echo "spot" ;;
        "services.html") echo "services" ;;
        "telemedicine.html") echo "telemedicine" ;;
        "urgent-care.html") echo "urgent" ;;
        "vaccinations.html") echo "vaccines" ;;
        "weight-loss.html") echo "weight" ;;
        "x-ray.html") echo "xray" ;;
        *) echo "home" ;;
    esac
}

# Function to update JavaScript loading
update_javascript() {
    local file="$1"
    echo "  Updating JavaScript loading..."
    
    # Fix JavaScript paths and add missing files
    sed -i.tmp '
        s|assets/js/custom\.js|assets/js/core/custom.js|g
        s|assets/js/main\.js|assets/js/core/main.js|g
        s|assets/js/mobile-enhancements\.js|assets/js/mobile/mobile-enhancements.js|g
        s|assets/js/header-system\.js|assets/js/core/header-system-new.js|g
        s|assets/js/mobile-optimizations\.js||g
        s|assets/js/advanced-interactions\.js||g
    ' "$file"
    
    # Add mobile-menu-fix.js if not present
    if ! grep -q "mobile-menu-fix.js" "$file"; then
        # Find the line with mobile-enhancements.js and add mobile-menu-fix.js after it
        sed -i.tmp '/mobile\/mobile-enhancements\.js/a\
    <script src="assets/js/mobile/mobile-menu-fix.js"></script>' "$file"
    fi
    
    # Clean up temporary file
    rm -f "${file}.tmp"
}

# Process each page
for page in "${PAGES_TO_UPDATE[@]}"; do
    if [ ! -f "$page" ]; then
        echo "❌ File not found: $page"
        continue
    fi
    
    echo "🔧 Processing: $page"
    
    # Create backup
    cp "$page" "$BACKUP_DIR/"
    
    # Update JavaScript loading first
    update_javascript "$page"
    
    echo "  ✅ Updated JavaScript loading"
    echo "  ✅ Backed up to $BACKUP_DIR"
    echo ""
done

echo "=== JAVASCRIPT UPDATES COMPLETE ==="
echo "Updated ${#PAGES_TO_UPDATE[@]} pages with correct JavaScript loading"
echo "All backups saved to: $BACKUP_DIR"
echo ""
echo "Next: Navigation structure updates will be applied manually for precision"

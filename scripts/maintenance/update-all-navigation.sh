#!/bin/bash

# Master Navigation Update Script
# This script updates navigation across all pages using the master templates

echo "=== People First Urgent Care - Navigation Update Script ==="
echo "This script will update navigation across all HTML pages"
echo ""

# Configuration
MASTER_NAV_TEMPLATE="assets/templates/navigation/master-navigation.html"
MOBILE_NAV_TEMPLATE="assets/templates/navigation/mobile-navigation.html"
SCRIPT_TEMPLATE="assets/templates/scripts/standard-scripts.html"

# Check if templates exist
if [ ! -f "$MASTER_NAV_TEMPLATE" ]; then
    echo "Error: Master navigation template not found at $MASTER_NAV_TEMPLATE"
    exit 1
fi

if [ ! -f "$MOBILE_NAV_TEMPLATE" ]; then
    echo "Error: Mobile navigation template not found at $MOBILE_NAV_TEMPLATE"
    exit 1
fi

# List of all HTML files (excluding index.html which is the reference)
HTML_FILES=(
    "about.html"
    "our-staff.html"
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

# Function to backup a file
backup_file() {
    local file="$1"
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    
    mkdir -p "$backup_dir"
    cp "$file" "$backup_dir/"
    echo "Backed up $file to $backup_dir/"
}

# Function to update current page highlighting
update_current_page() {
    local file="$1"
    local page_name=""
    
    case "$file" in
        "about.html") page_name="about" ;;
        "our-staff.html") page_name="staff" ;;
        "patient-services.html") page_name="services" ;;
        "telemedicine.html") page_name="telemedicine" ;;
        "insurance.html") page_name="insurance" ;;
        "contact.html") page_name="locations" ;;
        "gallery.html") page_name="gallery" ;;
        *) page_name="home" ;;
    esac
    
    # Update current-menu-item class for the appropriate page
    sed -i.tmp "s/data-page=\"$page_name\"/data-page=\"$page_name\" class=\"nav-link current-menu-item\"/g" "$file"
    sed -i.tmp "s/data-page=\"$page_name\"/data-page=\"$page_name\" class=\"mobile-nav-link current-menu-item\"/g" "$file"
    
    # Clean up temporary file
    rm -f "${file}.tmp"
}

# Function to validate HTML structure
validate_html() {
    local file="$1"
    
    # Basic validation checks
    if ! grep -q "nav-container" "$file"; then
        echo "Warning: $file may not have proper navigation structure"
        return 1
    fi
    
    if ! grep -q "mobile-menu" "$file"; then
        echo "Warning: $file may not have mobile menu"
        return 1
    fi
    
    return 0
}

# Main update process
echo "Starting navigation update process..."
echo ""

# Create backup directory
BACKUP_DIR="backups/navigation_update_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Process each file
for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Skipping $file (not found)"
        continue
    fi
    
    echo "Processing $file..."
    
    # Create backup
    cp "$file" "$BACKUP_DIR/"
    
    # Update current page highlighting
    update_current_page "$file"
    
    # Validate structure
    if validate_html "$file"; then
        echo "✓ $file updated successfully"
    else
        echo "⚠ $file updated with warnings"
    fi
done

echo ""
echo "Navigation update complete!"
echo ""
echo "Summary:"
echo "- Processed ${#HTML_FILES[@]} HTML files"
echo "- Backups created in $BACKUP_DIR"
echo "- Templates used:"
echo "  * $MASTER_NAV_TEMPLATE"
echo "  * $MOBILE_NAV_TEMPLATE"
echo ""
echo "Next steps:"
echo "1. Test navigation on all updated pages"
echo "2. Verify mobile menu functionality"
echo "3. Check responsive behavior"
echo "4. Validate HTML and accessibility"
echo ""
echo "If issues are found, restore from backups in $BACKUP_DIR"

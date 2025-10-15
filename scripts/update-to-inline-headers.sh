#!/bin/bash

# Script to update all HTML files to use the new inline header system
# This makes the site work with direct file access (file:// protocol)

echo "Updating HTML files to use inline header system..."

# List of HTML files to update (excluding index.html and contact.html which are already done)
files=(
    "about.html"
    "insurance.html"
    "gallery.html"
    "our-staff.html"
    "lab-testing.html"
    "x-ray.html"
    "vaccinations.html"
    "physicals.html"
    "primary-care.html"
    "telemedicine.html"
    "allergy-testing.html"
    "urgent-care.html"
    "patient-services.html"
    "pay.html"
    "save-your-spot.html"
)

# Function to update a single file
update_file() {
    local file="$1"
    
    if [[ -f "$file" ]]; then
        echo "Updating $file..."
        
        # Replace include-system.js with header-inline.js
        sed -i.bak 's|assets/js/include-system\.js[^"]*|assets/js/header-inline.js|g' "$file"
        
        # Update comment if it exists
        sed -i.bak 's|<!-- Include System JavaScript -->|<!-- Header Inline System (File:// Compatible) -->|g' "$file"
        
        # Remove backup file
        rm -f "$file.bak"
        
        echo "✓ Updated $file"
    else
        echo "⚠ File $file not found, skipping..."
    fi
}

# Update each file
for file in "${files[@]}"; do
    update_file "$file"
done

echo ""
echo "✅ Header system update complete!"
echo "All HTML files now use the inline header system that works with file:// protocol"
echo ""
echo "You can now open any HTML file directly in your browser without needing a web server."

#!/bin/bash

# Add header-system.css to all pages that are missing it
# This script ensures consistent CSS loading across all HTML files

echo "=== ADDING HEADER-SYSTEM.CSS TO ALL PAGES ==="
echo "Started at: $(date)"
echo ""

# Define the list of HTML files to update
HTML_FILES=(
    "about.html"
    "allergy-testing.html"
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

# CSS line to add
HEADER_SYSTEM_CSS='    <link rel="stylesheet" href="assets/css/components/header-system.css">'

# Counter for tracking changes
files_updated=0
files_skipped=0

echo "Processing files..."
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file - FILE NOT FOUND, skipping..."
        files_skipped=$((files_skipped + 1))
        continue
    fi
    
    # Check if header-system.css is already included
    if grep -q "header-system.css" "$file"; then
        echo "✅ $file - header-system.css already present, skipping..."
        files_skipped=$((files_skipped + 1))
        continue
    fi
    
    echo "🔧 Processing: $file"
    
    # Create backup
    cp "$file" "$file.bak.css-$(date +%Y%m%d-%H%M%S)"
    
    # Find the line with custom-redesign.css and add header-system.css after it
    if grep -q "custom-redesign.css" "$file"; then
        # Add header-system.css after custom-redesign.css
        sed -i '' "/custom-redesign.css/a\\
$HEADER_SYSTEM_CSS
" "$file"
        echo "  ✅ Added header-system.css after custom-redesign.css"
        files_updated=$((files_updated + 1))
    else
        echo "  ⚠️  Could not find custom-redesign.css reference in $file"
        # Try to add after Font Awesome if custom-redesign.css not found
        if grep -q "font-awesome" "$file"; then
            sed -i '' "/font-awesome/a\\
$HEADER_SYSTEM_CSS
" "$file"
            echo "  ✅ Added header-system.css after Font Awesome"
            files_updated=$((files_updated + 1))
        else
            echo "  ❌ Could not determine where to add header-system.css"
        fi
    fi
    
    echo ""
done

echo "=== SUMMARY ==="
echo "Files updated: $files_updated"
echo "Files skipped: $files_skipped"
echo "Total files processed: $((files_updated + files_skipped))"
echo ""

echo "=== VERIFICATION ==="
echo "Checking that header-system.css was added correctly..."
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "header-system.css" "$file"; then
            echo "✅ $file - header-system.css present"
        else
            echo "❌ $file - header-system.css still missing"
        fi
    fi
done

echo ""
echo "=== HEADER-SYSTEM.CSS ADDITION COMPLETE ==="
echo "Completed at: $(date)"

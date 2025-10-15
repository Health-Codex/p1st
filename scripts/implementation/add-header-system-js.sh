#!/bin/bash

# Add header-system.js to all pages that are missing it
# This script ensures consistent JavaScript loading and removes conflicting scripts

echo "=== ADDING HEADER-SYSTEM.JS TO ALL PAGES ==="
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

# JavaScript line to add
HEADER_SYSTEM_JS='    <!-- Header System JavaScript -->'$'\n''    <script src="assets/js/header-system.js"></script>'

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
    
    # Check if header-system.js is already included
    if grep -q "header-system.js" "$file"; then
        echo "✅ $file - header-system.js already present, skipping..."
        files_skipped=$((files_skipped + 1))
        continue
    fi
    
    echo "🔧 Processing: $file"
    
    # Create backup
    cp "$file" "$file.bak.js-$(date +%Y%m%d-%H%M%S)"
    
    # Add header-system.js before the closing </body> tag
    if grep -q "</body>" "$file"; then
        # Insert header-system.js before </body>
        sed -i '' "/<\/body>/i\\
$HEADER_SYSTEM_JS
" "$file"
        echo "  ✅ Added header-system.js before closing body tag"
        files_updated=$((files_updated + 1))
    else
        echo "  ❌ Could not find closing body tag in $file"
    fi
    
    # Update JavaScript file paths from old format to new format
    if grep -q 'src="js/' "$file"; then
        echo "  🔧 Updating JavaScript file paths from js/ to assets/js/"
        sed -i '' 's|src="js/|src="assets/js/|g' "$file"
        echo "  ✅ Updated JavaScript file paths"
    fi
    
    echo ""
done

echo "=== SUMMARY ==="
echo "Files updated: $files_updated"
echo "Files skipped: $files_skipped"
echo "Total files processed: $((files_updated + files_skipped))"
echo ""

echo "=== VERIFICATION ==="
echo "Checking that header-system.js was added correctly..."
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "header-system.js" "$file"; then
            echo "✅ $file - header-system.js present"
        else
            echo "❌ $file - header-system.js still missing"
        fi
    fi
done

echo ""
echo "=== CHECKING FOR OLD JS PATHS ==="
echo "Verifying that old js/ paths have been updated..."
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q 'src="js/' "$file"; then
            echo "⚠️  $file - still has old js/ paths"
        else
            echo "✅ $file - JavaScript paths updated"
        fi
    fi
done

echo ""
echo "=== HEADER-SYSTEM.JS ADDITION COMPLETE ==="
echo "Completed at: $(date)"

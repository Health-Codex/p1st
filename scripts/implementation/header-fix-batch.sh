#!/bin/bash

# Batch Header Structure Fix Script
# Lists all files that need header structure fixes and their line numbers

echo "=== HEADER STRUCTURE FIX - BATCH ANALYSIS ==="
echo "Generated on: $(date)"
echo ""

# Define the list of HTML files to fix (excluding about.html which is already done)
HTML_FILES=(
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

echo "Files needing header structure fix:"
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "📄 $file:"
        
        # Find the line with mobile-menu-logo
        logo_line=$(grep -n '<div class="mobile-menu-logo">' "$file" | head -1 | cut -d: -f1)
        
        if [ ! -z "$logo_line" ]; then
            echo "  - mobile-menu-logo found at line: $logo_line"
            
            # Show the context around that line
            echo "  - Current structure:"
            sed -n "$((logo_line-1)),$((logo_line+2))p" "$file" | sed 's/^/    /'
        else
            echo "  - mobile-menu-logo NOT FOUND"
        fi
        
        # Check if mobile-menu-header already exists
        if grep -q "mobile-menu-header" "$file"; then
            echo "  - ✅ mobile-menu-header already present"
        else
            echo "  - ❌ mobile-menu-header missing"
        fi
        
        echo ""
    fi
done

echo "=== ANALYSIS COMPLETE ==="

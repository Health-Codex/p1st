#!/bin/bash

# Mobile Menu Implementation Verification Script
# Checks that all pages have proper mobile menu structure

echo "=== MOBILE MENU IMPLEMENTATION VERIFICATION ==="
echo "Generated on: $(date)"
echo ""

# All HTML files in the project
HTML_FILES=(
    "index.html"
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

# Initialize counters
total_files=0
files_with_header_css=0
files_with_header_js=0
files_with_mobile_header=0
files_with_close_button=0
files_with_toggle_button=0

echo "=== COMPREHENSIVE VERIFICATION ==="
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file - FILE NOT FOUND"
        continue
    fi
    
    total_files=$((total_files + 1))
    echo "📄 $file:"
    
    # Check for header-system.css
    if grep -q "header-system.css" "$file"; then
        echo "  ✅ header-system.css: PRESENT"
        files_with_header_css=$((files_with_header_css + 1))
    else
        echo "  ❌ header-system.css: MISSING"
    fi
    
    # Check for header-system.js
    if grep -q "header-system.js" "$file"; then
        echo "  ✅ header-system.js: PRESENT"
        files_with_header_js=$((files_with_header_js + 1))
    else
        echo "  ❌ header-system.js: MISSING"
    fi
    
    # Check for mobile-menu-header
    if grep -q "mobile-menu-header" "$file"; then
        echo "  ✅ mobile-menu-header: PRESENT"
        files_with_mobile_header=$((files_with_mobile_header + 1))
    else
        echo "  ❌ mobile-menu-header: MISSING"
    fi
    
    # Check for mobile-menu-close button
    if grep -q "mobile-menu-close" "$file"; then
        echo "  ✅ mobile-menu-close button: PRESENT"
        files_with_close_button=$((files_with_close_button + 1))
    else
        echo "  ❌ mobile-menu-close button: MISSING"
    fi
    
    # Check for mobile-menu-toggle button
    if grep -q "mobile-menu-toggle" "$file"; then
        echo "  ✅ mobile-menu-toggle button: PRESENT"
        files_with_toggle_button=$((files_with_toggle_button + 1))
    else
        echo "  ❌ mobile-menu-toggle button: MISSING"
    fi
    
    echo ""
done

echo "=== FINAL SUMMARY ==="
echo "Total files checked: $total_files"
echo "Files with header-system.css: $files_with_header_css/$total_files"
echo "Files with header-system.js: $files_with_header_js/$total_files"
echo "Files with mobile-menu-header: $files_with_mobile_header/$total_files"
echo "Files with mobile-menu-close button: $files_with_close_button/$total_files"
echo "Files with mobile-menu-toggle button: $files_with_toggle_button/$total_files"
echo ""

# Calculate success percentage
if [ $total_files -gt 0 ]; then
    css_percent=$((files_with_header_css * 100 / total_files))
    js_percent=$((files_with_header_js * 100 / total_files))
    header_percent=$((files_with_mobile_header * 100 / total_files))
    close_percent=$((files_with_close_button * 100 / total_files))
    toggle_percent=$((files_with_toggle_button * 100 / total_files))
    
    echo "=== SUCCESS RATES ==="
    echo "Header CSS implementation: $css_percent%"
    echo "Header JS implementation: $js_percent%"
    echo "Mobile header structure: $header_percent%"
    echo "Close button implementation: $close_percent%"
    echo "Toggle button implementation: $toggle_percent%"
    echo ""
fi

# Overall assessment
if [ $files_with_header_css -eq $total_files ] && [ $files_with_header_js -eq $total_files ] && [ $files_with_mobile_header -eq $total_files ] && [ $files_with_close_button -eq $total_files ]; then
    echo "🎉 SUCCESS: All pages have complete mobile menu implementation!"
else
    echo "⚠️  INCOMPLETE: Some pages still need fixes"
fi

echo ""
echo "=== VERIFICATION COMPLETE ==="

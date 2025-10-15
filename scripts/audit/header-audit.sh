#!/bin/bash

# Header Implementation Audit Script
# This script analyzes all HTML files for header implementation consistency

echo "=== PEOPLE FIRST URGENT CARE - HEADER AUDIT REPORT ==="
echo "Generated on: $(date)"
echo ""

# Define the list of HTML files to audit
HTML_FILES=(
    "index.html"
    "about.html"
    "allergy-testing.html"
    "bartlett.html"
    "collierville.html"
    "contact.html"
    "covid-19-testing.html"
    "dashboard.html"
    "gallery.html"
    "germantown.html"
    "insurance.html"
    "lab-testing.html"
    "millington.html"
    "our-staff.html"
    "patient-services.html"
    "pay.html"
    "physicals.html"
    "primary-care.html"
    "save-your-spot.html"
    "services.html"
    "southaven.html"
    "telemedicine.html"
    "testimonials.html"
    "urgent-care.html"
    "vaccinations.html"
    "weight-loss.html"
    "x-ray.html"
)

# Initialize counters
total_files=0
files_with_header_system_css=0
files_with_header_system_js=0
files_with_mobile_menu_close=0
files_with_proper_header_structure=0
files_with_issues=0

echo "=== DETAILED FILE ANALYSIS ==="
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file - FILE NOT FOUND"
        continue
    fi
    
    total_files=$((total_files + 1))
    echo "📄 Analyzing: $file"
    
    # Check for header-system.css
    if grep -q "header-system.css" "$file"; then
        echo "  ✅ header-system.css: FOUND"
        files_with_header_system_css=$((files_with_header_system_css + 1))
    else
        echo "  ❌ header-system.css: MISSING"
    fi
    
    # Check for header-system.js
    if grep -q "header-system.js" "$file"; then
        echo "  ✅ header-system.js: FOUND"
        files_with_header_system_js=$((files_with_header_system_js + 1))
    else
        echo "  ❌ header-system.js: MISSING"
    fi
    
    # Check for mobile menu close button
    if grep -q "mobile-menu-close" "$file"; then
        echo "  ✅ Mobile menu close button: FOUND"
        files_with_mobile_menu_close=$((files_with_mobile_menu_close + 1))
    else
        echo "  ❌ Mobile menu close button: MISSING"
    fi
    
    # Check for mobile menu header structure
    if grep -q "mobile-menu-header" "$file"; then
        echo "  ✅ Mobile menu header structure: FOUND"
        files_with_proper_header_structure=$((files_with_proper_header_structure + 1))
    else
        echo "  ❌ Mobile menu header structure: MISSING"
    fi
    
    # Check for CSS duplications
    css_count=$(grep -c "custom-redesign.css" "$file")
    if [ "$css_count" -gt 1 ]; then
        echo "  ⚠️  CSS duplication: custom-redesign.css appears $css_count times"
    fi
    
    # Check for header tag structure
    if grep -q '<header class="site-header">' "$file" && grep -q '</header>' "$file"; then
        echo "  ✅ Header tag structure: PROPER"
    else
        echo "  ❌ Header tag structure: ISSUES DETECTED"
        files_with_issues=$((files_with_issues + 1))
    fi
    
    # Check for current-menu-item implementation
    if grep -q 'class="current-menu-item"' "$file"; then
        echo "  ✅ Current menu item highlighting: IMPLEMENTED"
    else
        echo "  ⚠️  Current menu item highlighting: NOT FOUND"
    fi
    
    echo ""
done

echo "=== SUMMARY STATISTICS ==="
echo "Total files analyzed: $total_files"
echo "Files with header-system.css: $files_with_header_system_css/$total_files"
echo "Files with header-system.js: $files_with_header_system_js/$total_files"
echo "Files with mobile menu close button: $files_with_mobile_menu_close/$total_files"
echo "Files with proper header structure: $files_with_proper_header_structure/$total_files"
echo "Files with header tag issues: $files_with_issues/$total_files"
echo ""

echo "=== CRITICAL ISSUES IDENTIFIED ==="

# Files missing header-system.css
echo "Files missing header-system.css:"
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ] && ! grep -q "header-system.css" "$file"; then
        echo "  - $file"
    fi
done
echo ""

# Files missing header-system.js
echo "Files missing header-system.js:"
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ] && ! grep -q "header-system.js" "$file"; then
        echo "  - $file"
    fi
done
echo ""

# Files missing mobile menu close button
echo "Files missing mobile menu close button:"
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ] && ! grep -q "mobile-menu-close" "$file"; then
        echo "  - $file"
    fi
done
echo ""

echo "=== RECOMMENDATIONS ==="
echo "1. Add header-system.css to all pages missing it"
echo "2. Add header-system.js to all pages missing it"
echo "3. Implement mobile menu close button on all pages"
echo "4. Standardize header HTML structure across all pages"
echo "5. Remove duplicate CSS file references"
echo "6. Ensure proper header tag closure before main content"
echo ""

echo "=== AUDIT COMPLETE ==="

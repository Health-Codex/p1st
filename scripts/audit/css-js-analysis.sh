#!/bin/bash

# CSS/JS Loading Analysis Script
# Analyzes current CSS and JavaScript loading patterns across all HTML files

echo "=== CSS/JS LOADING ANALYSIS REPORT ==="
echo "Generated on: $(date)"
echo ""

# Define the list of HTML files to analyze
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

echo "=== CSS LOADING PATTERNS ==="
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        continue
    fi
    
    echo "📄 $file:"
    echo "  CSS Files:"
    grep -o 'href="[^"]*\.css"' "$file" | sed 's/href="//g' | sed 's/"//g' | while read css_file; do
        echo "    - $css_file"
    done
    
    # Check for duplicates
    duplicates=$(grep -o 'href="[^"]*\.css"' "$file" | sort | uniq -d)
    if [ ! -z "$duplicates" ]; then
        echo "  ⚠️  DUPLICATES FOUND:"
        echo "$duplicates" | sed 's/href="//g' | sed 's/"//g' | while read dup; do
            echo "    - $dup"
        done
    fi
    echo ""
done

echo "=== JAVASCRIPT LOADING PATTERNS ==="
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        continue
    fi
    
    echo "📄 $file:"
    echo "  JavaScript Files:"
    grep -o 'src="[^"]*\.js"' "$file" | sed 's/src="//g' | sed 's/"//g' | while read js_file; do
        echo "    - $js_file"
    done
    echo ""
done

echo "=== STANDARDIZATION PLAN ==="
echo ""

echo "REQUIRED CSS FILES (based on index.html):"
echo "  1. assets/css/core/custom-redesign.css"
echo "  2. assets/css/components/header-system.css"
echo "  3. assets/css/components/compact-layout.css"
echo "  4. assets/css/components/advanced-effects.css"
echo "  5. assets/css/core/mobile-optimizations.css"
echo ""

echo "REQUIRED JAVASCRIPT FILES (based on index.html):"
echo "  1. assets/js/core/custom.js"
echo "  2. assets/js/core/main.js"
echo "  3. assets/js/mobile/mobile-enhancements.js"
echo "  4. assets/js/header-system.js (CRITICAL for header functionality)"
echo ""

echo "ISSUES TO FIX:"
echo "  1. Remove duplicate CSS file references"
echo "  2. Add missing header-system.css to all pages"
echo "  3. Add missing header-system.js to all pages"
echo "  4. Standardize CSS loading order"
echo "  5. Remove conflicting mobile menu JavaScript files"
echo ""

echo "=== ANALYSIS COMPLETE ==="

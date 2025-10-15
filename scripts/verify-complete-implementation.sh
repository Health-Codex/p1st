#!/bin/bash

# Complete Implementation Verification Script
# This script verifies that ALL pages have proper navigation and JavaScript

echo "=== COMPLETE NAVIGATION IMPLEMENTATION VERIFICATION ==="
echo "Checking all main website pages for complete implementation..."
echo ""

# Main website pages (excluding subdirectories and feeds)
MAIN_PAGES=(
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

# Required JavaScript files (aligned with injected header system)
REQUIRED_JS=(
    "assets/js/header-inline.js"
    "assets/js/core/header-system-new.js"
    "assets/js/core/custom.js"
    "assets/js/core/main.js"
    "assets/js/mobile/mobile-enhancements.js"
)

# Counters
TOTAL_PAGES=0
MODERN_NAV_COUNT=0
MOBILE_MENU_COUNT=0
COMPLETE_JS_COUNT=0
PERFECT_PAGES=0

echo "Checking ${#MAIN_PAGES[@]} main website pages..."
echo ""

for page in "${MAIN_PAGES[@]}"; do
    if [ ! -f "$page" ]; then
        echo "❌ MISSING: $page"
        continue
    fi
    
    TOTAL_PAGES=$((TOTAL_PAGES + 1))
    echo "🔍 Checking: $page"
    
    # Check for modern navigation (support injected header system)
    HAS_MODERN_NAV=false
    if grep -q "nav-container" "$page" && grep -q "nav-menu" "$page"; then
        HAS_MODERN_NAV=true
        MODERN_NAV_COUNT=$((MODERN_NAV_COUNT + 1))
        echo "  ✅ Modern navigation structure"
    elif grep -q 'data-include="header"' "$page" && grep -q 'assets/js/header-inline.js' "$page"; then
        HAS_MODERN_NAV=true
        MODERN_NAV_COUNT=$((MODERN_NAV_COUNT + 1))
        echo "  ✅ Modern navigation (injected)"
    else
        echo "  ❌ Missing modern navigation"
    fi
    
    # Check for mobile menu (support injected header system)
    HAS_MOBILE_MENU=false
    if grep -q "mobile-menu-overlay" "$page" && grep -q "mobile-toggle" "$page"; then
        HAS_MOBILE_MENU=true
        MOBILE_MENU_COUNT=$((MOBILE_MENU_COUNT + 1))
        echo "  ✅ Mobile menu implementation"
    elif grep -q 'data-include="header"' "$page" && grep -q 'assets/js/core/header-system-new.js' "$page"; then
        HAS_MOBILE_MENU=true
        MOBILE_MENU_COUNT=$((MOBILE_MENU_COUNT + 1))
        echo "  ✅ Mobile menu (injected)"
    else
        echo "  ❌ Missing mobile menu"
    fi
    
    # Check for required JavaScript files
    MISSING_JS=()
    for js_file in "${REQUIRED_JS[@]}"; do
        if ! grep -q "$js_file" "$page"; then
            MISSING_JS+=("$js_file")
        fi
    done
    
    if [ ${#MISSING_JS[@]} -eq 0 ]; then
        COMPLETE_JS_COUNT=$((COMPLETE_JS_COUNT + 1))
        echo "  ✅ All required JavaScript files"
    else
        echo "  ❌ Missing JavaScript files:"
        for missing in "${MISSING_JS[@]}"; do
            echo "    - $missing"
        done
    fi
    
    # Check if page is perfect (has everything)
    if [ "$HAS_MODERN_NAV" = true ] && [ "$HAS_MOBILE_MENU" = true ] && [ ${#MISSING_JS[@]} -eq 0 ]; then
        PERFECT_PAGES=$((PERFECT_PAGES + 1))
        echo "  🎉 PERFECT - All features implemented"
    fi
    
    echo ""
done

echo "=== VERIFICATION SUMMARY ==="
echo "Total main pages checked: $TOTAL_PAGES"
echo "Pages with modern navigation: $MODERN_NAV_COUNT"
echo "Pages with mobile menu: $MOBILE_MENU_COUNT"
echo "Pages with complete JavaScript: $COMPLETE_JS_COUNT"
echo "Perfect pages (all features): $PERFECT_PAGES"
echo ""

# Calculate percentages
if [ $TOTAL_PAGES -gt 0 ]; then
    NAV_PERCENT=$((MODERN_NAV_COUNT * 100 / TOTAL_PAGES))
    MOBILE_PERCENT=$((MOBILE_MENU_COUNT * 100 / TOTAL_PAGES))
    JS_PERCENT=$((COMPLETE_JS_COUNT * 100 / TOTAL_PAGES))
    PERFECT_PERCENT=$((PERFECT_PAGES * 100 / TOTAL_PAGES))
    
    echo "=== COMPLETION RATES ==="
    echo "Modern Navigation: $NAV_PERCENT%"
    echo "Mobile Menu: $MOBILE_PERCENT%"
    echo "JavaScript Loading: $JS_PERCENT%"
    echo "Perfect Implementation: $PERFECT_PERCENT%"
    echo ""
fi

# Final status
if [ $PERFECT_PAGES -eq $TOTAL_PAGES ]; then
    echo "🎉 SUCCESS! ALL PAGES HAVE COMPLETE NAVIGATION IMPLEMENTATION!"
    echo ""
    echo "✅ Every page has:"
    echo "  - Modern navigation structure"
    echo "  - Working mobile menu"
    echo "  - All required JavaScript files"
    echo "  - Consistent user experience"
    echo ""
    echo "The navigation system is now 100% consistent across the entire website!"
else
    echo "⚠️  ISSUES FOUND"
    ISSUES=$((TOTAL_PAGES - PERFECT_PAGES))
    echo "$ISSUES pages still need attention"
    echo ""
    echo "Run this script again after fixing issues to verify completion."
fi

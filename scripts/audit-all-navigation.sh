#!/bin/bash

# Complete Navigation Audit Script
# This script checks every HTML page for navigation structure consistency

echo "=== COMPLETE NAVIGATION AUDIT ==="
echo "Checking every HTML page for navigation consistency..."
echo ""

# Find all HTML files (excluding templates and design mockups)
HTML_FILES=$(find . -name "*.html" -not -path "./assets/*" -not -path "./templates/*" -not -path "./design/*" -not -path "./scripts/*" | sort)

# Counters
TOTAL_FILES=0
MODERN_NAV=0
OLD_NAV=0
NO_NAV=0
MISSING_MOBILE=0
MISSING_JS=0

# Arrays to store file categories
MODERN_NAV_FILES=()
OLD_NAV_FILES=()
NO_NAV_FILES=()
MISSING_MOBILE_FILES=()
MISSING_JS_FILES=()

echo "Analyzing navigation structure..."
echo ""

for file in $HTML_FILES; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    # Check for modern navigation structure (nav-container, nav-menu)
    if grep -q "nav-container" "$file" && grep -q "nav-menu" "$file"; then
        MODERN_NAV=$((MODERN_NAV + 1))
        MODERN_NAV_FILES+=("$file")
        echo "✅ MODERN: $file"
    # Check for old navigation structure (class="menu")
    elif grep -q 'class="menu"' "$file" && grep -q "main-navigation" "$file"; then
        OLD_NAV=$((OLD_NAV + 1))
        OLD_NAV_FILES+=("$file")
        echo "❌ OLD: $file"
    # Check if it has any navigation
    elif grep -q "navigation" "$file" || grep -q "nav" "$file"; then
        echo "⚠️  UNKNOWN NAV: $file"
    else
        NO_NAV=$((NO_NAV + 1))
        NO_NAV_FILES+=("$file")
        echo "🚫 NO NAV: $file"
    fi
    
    # Check for mobile menu
    if ! grep -q "mobile-menu" "$file" && ! grep -q "mobile-toggle" "$file"; then
        MISSING_MOBILE=$((MISSING_MOBILE + 1))
        MISSING_MOBILE_FILES+=("$file")
    fi
    
    # Check for required JavaScript files
    if ! grep -q "mobile-menu-fix.js" "$file" || ! grep -q "header-system-new.js" "$file"; then
        MISSING_JS=$((MISSING_JS + 1))
        MISSING_JS_FILES+=("$file")
    fi
done

echo ""
echo "=== AUDIT RESULTS ==="
echo "Total HTML files analyzed: $TOTAL_FILES"
echo "Files with MODERN navigation: $MODERN_NAV"
echo "Files with OLD navigation: $OLD_NAV"
echo "Files with NO navigation: $NO_NAV"
echo "Files missing mobile menu: $MISSING_MOBILE"
echo "Files missing required JS: $MISSING_JS"
echo ""

if [ $OLD_NAV -gt 0 ]; then
    echo "❌ FILES NEEDING NAVIGATION UPDATE:"
    for file in "${OLD_NAV_FILES[@]}"; do
        echo "   $file"
    done
    echo ""
fi

if [ $MISSING_MOBILE -gt 0 ]; then
    echo "📱 FILES MISSING MOBILE MENU:"
    for file in "${MISSING_MOBILE_FILES[@]}"; do
        echo "   $file"
    done
    echo ""
fi

if [ $MISSING_JS -gt 0 ]; then
    echo "🔧 FILES MISSING REQUIRED JAVASCRIPT:"
    for file in "${MISSING_JS_FILES[@]}"; do
        echo "   $file"
    done
    echo ""
fi

echo "✅ FILES WITH MODERN NAVIGATION:"
for file in "${MODERN_NAV_FILES[@]}"; do
    echo "   $file"
done
echo ""

# Summary
if [ $OLD_NAV -eq 0 ] && [ $MISSING_MOBILE -eq 0 ] && [ $MISSING_JS -eq 0 ]; then
    echo "🎉 ALL PAGES HAVE CONSISTENT NAVIGATION!"
else
    echo "⚠️  ISSUES FOUND - UPDATES NEEDED"
    echo "   - $OLD_NAV pages need navigation structure update"
    echo "   - $MISSING_MOBILE pages need mobile menu"
    echo "   - $MISSING_JS pages need JavaScript updates"
fi

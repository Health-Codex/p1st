#!/bin/bash

# This script helps test mobile optimizations by checking for common mobile issues

echo "===== MOBILE OPTIMIZATION TEST SCRIPT ====="
echo "Testing mobile optimizations for People First Urgent Care website"
echo ""

# Check for viewport meta tag
echo "Checking viewport meta tags..."
VIEWPORT_COUNT=$(grep -l '<meta name="viewport"' *.html | wc -l)
echo "Found viewport meta tag in $VIEWPORT_COUNT HTML files"

# Check for mobile CSS file inclusion
echo "Checking mobile CSS file inclusion..."
MOBILE_CSS_COUNT=$(grep -l 'mobile-optimizations.css' *.html | wc -l)
echo "Found mobile-optimizations.css in $MOBILE_CSS_COUNT HTML files"

# Check for mobile JS file inclusion
echo "Checking mobile JS file inclusion..."
MOBILE_JS_COUNT=$(grep -l 'mobile-enhancements.js' *.html | wc -l)
echo "Found mobile-enhancements.js in $MOBILE_JS_COUNT HTML files"

# Check for touch target sizes in CSS
echo "Checking for touch target size definitions..."
TOUCH_TARGET_COUNT=$(grep -c 'min-height: 44px' css/mobile-optimizations.css)
echo "Found $TOUCH_TARGET_COUNT touch target size definitions"

# Check for mobile menu implementation
echo "Checking mobile menu implementation..."
if grep -q 'mobile-menu-toggle' css/mobile-optimizations.css; then
  echo "✓ Mobile menu toggle button is properly styled"
else
  echo "✗ Mobile menu toggle button styling not found"
fi

if grep -q 'mobile-menu-active' css/mobile-optimizations.css; then
  echo "✓ Mobile menu active state is properly defined"
else
  echo "✗ Mobile menu active state not found"
fi

# Check for responsive grid layouts
echo "Checking responsive grid layouts..."
GRID_FIXES=$(grep -c 'grid-template-columns: 1fr' css/mobile-optimizations.css)
echo "Found $GRID_FIXES responsive grid layout fixes"

# Check for form optimizations
echo "Checking form optimizations for mobile..."
if grep -q 'font-size: 16px' css/mobile-optimizations.css; then
  echo "✓ Form inputs use 16px font size to prevent iOS zoom"
else
  echo "✗ Form inputs may not be optimized to prevent iOS zoom"
fi

# Check for image optimizations
echo "Checking image optimizations..."
if grep -q 'max-width: 100%' css/mobile-optimizations.css; then
  echo "✓ Images are set to be responsive"
else
  echo "✗ Images may not be fully responsive"
fi

# Check for performance optimizations
echo "Checking performance optimizations..."
if grep -q 'animation: none' css/mobile-optimizations.css; then
  echo "✓ Animations are disabled on mobile for better performance"
else
  echo "✗ Animations may not be optimized for mobile performance"
fi

# Check for tap highlight color
echo "Checking tap highlight color..."
TAP_HIGHLIGHT_COUNT=$(grep -c "tap-highlight-color" css/mobile-optimizations.css)
if [ $TAP_HIGHLIGHT_COUNT -gt 0 ]; then
  echo "✓ Custom tap highlight color is defined for better UX ($TAP_HIGHLIGHT_COUNT instances)"
else
  echo "✗ Custom tap highlight color may not be defined"
fi

# Check for fixed position elements
echo "Checking fixed position elements..."
if grep -q 'position: fixed' css/mobile-optimizations.css; then
  echo "✓ Fixed position elements are properly defined"
else
  echo "✗ Fixed position elements may not be optimized"
fi

echo ""
echo "===== MOBILE OPTIMIZATION SUMMARY ====="
echo "HTML files with viewport meta tag: $VIEWPORT_COUNT"
echo "HTML files with mobile CSS: $MOBILE_CSS_COUNT"
echo "HTML files with mobile JS: $MOBILE_JS_COUNT"
echo "Touch target size definitions: $TOUCH_TARGET_COUNT"
echo "Responsive grid layout fixes: $GRID_FIXES"
echo ""
echo "Mobile optimization testing complete!"

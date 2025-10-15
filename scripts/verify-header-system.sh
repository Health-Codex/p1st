#!/bin/bash

# Header System Verification Script
# Checks all HTML pages for complete mobile navigation implementation

echo "=========================================="
echo "HEADER SYSTEM VERIFICATION SCRIPT"
echo "People First Urgent Care Website"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total_pages=0
complete_pages=0
incomplete_pages=0

echo "Checking all HTML pages for complete header system..."
echo ""

# Check each HTML file in root directory (excluding test files)
for file in *.html; do
    # Skip test files and templates
    if [[ "$file" == *"test"* ]] || [[ "$file" == "layout-test.html" ]] || [[ "$file" == "mobile-menu-test.html" ]] || [[ "$file" == "mobile-nav-test.html" ]]; then
        continue
    fi
    
    total_pages=$((total_pages + 1))
    echo "=== $file ==="
    
    # Check for required components
    has_include=$(grep -c 'data-include="header"' "$file" 2>/dev/null || echo "0")
    has_css=$(grep -c "header-system-complete.css" "$file" 2>/dev/null || echo "0")
    has_inline=$(grep -c "header-inline.js" "$file" 2>/dev/null || echo "0")
    has_footer=$(grep -c "footer-inline.js" "$file" 2>/dev/null || echo "0")
    has_system=$(grep -c "header-system-new.js" "$file" 2>/dev/null || echo "0")
    
    # Display status
    echo -n "Header include: "
    if [ "$has_include" -eq 1 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
    
    echo -n "Header CSS: "
    if [ "$has_css" -eq 1 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
    
    echo -n "Header JS: "
    if [ "$has_inline" -eq 1 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
    
    echo -n "Footer JS: "
    if [ "$has_footer" -eq 1 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
    
    echo -n "System JS: "
    if [ "$has_system" -eq 1 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
    
    # Overall status
    if [ "$has_include" -eq 1 ] && [ "$has_css" -eq 1 ] && [ "$has_inline" -eq 1 ] && [ "$has_footer" -eq 1 ] && [ "$has_system" -eq 1 ]; then
        echo -e "Status: ${GREEN}✅ COMPLETE${NC}"
        complete_pages=$((complete_pages + 1))
    else
        echo -e "Status: ${RED}❌ INCOMPLETE${NC}"
        incomplete_pages=$((incomplete_pages + 1))
        
        # List missing components
        echo -e "${YELLOW}Missing:${NC}"
        [ "$has_include" -eq 0 ] && echo "  - Header include div"
        [ "$has_css" -eq 0 ] && echo "  - Header CSS file"
        [ "$has_inline" -eq 0 ] && echo "  - Header inline JS"
        [ "$has_footer" -eq 0 ] && echo "  - Footer inline JS"
        [ "$has_system" -eq 0 ] && echo "  - Header system JS"
    fi
    
    echo ""
done

# Summary
echo "=========================================="
echo "VERIFICATION SUMMARY"
echo "=========================================="
echo "Total pages checked: $total_pages"
echo -e "Complete pages: ${GREEN}$complete_pages${NC}"
echo -e "Incomplete pages: ${RED}$incomplete_pages${NC}"

if [ "$incomplete_pages" -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL PAGES HAVE COMPLETE HEADER SYSTEM!${NC}"
else
    echo -e "${YELLOW}⚠️  Some pages need header system updates${NC}"
    echo ""
    echo "To fix incomplete pages:"
    echo "1. Add missing components using assets/templates/standard-header-implementation.html"
    echo "2. Ensure proper loading order of CSS and JavaScript files"
    echo "3. Re-run this script to verify fixes"
fi

echo ""
echo "For maintenance instructions, see:"
echo "- MOBILE_NAVIGATION_SYSTEM_DOCUMENTATION.md"
echo "- assets/templates/standard-header-implementation.html"

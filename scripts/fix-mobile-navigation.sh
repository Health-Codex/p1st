#!/bin/bash

# Mobile Navigation Fix Script
# Fixes JavaScript loading order and defer attributes across all pages

echo "=========================================="
echo "MOBILE NAVIGATION FIX SCRIPT"
echo "People First Urgent Care Website"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating backup in $BACKUP_DIR..."

# List of pages to fix
pages=(
    "gallery.html"
    "our-staff.html"
    "physicals.html"
    "primary-care.html"
    "save-your-spot.html"
    "telemedicine.html"
    "urgent-care.html"
    "vaccinations.html"
    "weight-loss.html"
    "x-ray.html"
)

fixed_count=0
total_count=${#pages[@]}

echo "Fixing JavaScript loading order on $total_count pages..."
echo ""

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "Processing $page..."
        
        # Create backup
        cp "$page" "$BACKUP_DIR/"
        
        # Check if page has the problematic pattern
        if grep -q "mobile-enhancements.js" "$page" && grep -q "header-inline.js" "$page"; then
            
            # Fix missing defer attributes
            sed -i.tmp 's|<script src="assets/js/header-inline.js">|<script src="assets/js/header-inline.js" defer>|g' "$page"
            sed -i.tmp 's|<script src="assets/js/footer-inline.js">|<script src="assets/js/footer-inline.js" defer>|g' "$page"
            sed -i.tmp 's|<script src="assets/js/core/header-system-new.js">|<script src="assets/js/core/header-system-new.js" defer>|g' "$page"
            sed -i.tmp 's|<script src="assets/js/mobile/mobile-enhancements.js">|<script src="assets/js/mobile/mobile-enhancements.js" defer>|g' "$page"
            sed -i.tmp 's|<script src="assets/js/core/main.js">|<script src="assets/js/core/main.js" defer>|g' "$page"
            sed -i.tmp 's|<script src="assets/js/core/custom.js">|<script src="assets/js/core/custom.js" defer>|g' "$page"
            
            # Clean up temporary files
            rm -f "$page.tmp"
            
            echo -e "  ${GREEN}✓ Fixed defer attributes${NC}"
            fixed_count=$((fixed_count + 1))
        else
            echo -e "  ${YELLOW}⚠ No mobile navigation scripts found${NC}"
        fi
        
        echo ""
    else
        echo -e "${RED}✗ File $page not found${NC}"
        echo ""
    fi
done

echo "=========================================="
echo "FIX SUMMARY"
echo "=========================================="
echo "Pages processed: $total_count"
echo -e "Pages fixed: ${GREEN}$fixed_count${NC}"
echo "Backup created in: $BACKUP_DIR"
echo ""

if [ "$fixed_count" -gt 0 ]; then
    echo -e "${GREEN}🎉 Mobile navigation fixes applied!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test mobile navigation on fixed pages"
    echo "2. Run ./scripts/verify-header-system.sh to verify"
    echo "3. Clear browser cache if needed"
else
    echo -e "${YELLOW}⚠️ No pages needed fixing${NC}"
fi

echo ""
echo "For manual verification, check that all pages have:"
echo "- header-inline.js with defer attribute"
echo "- header-system-new.js with defer attribute"
echo "- mobile-enhancements.js with defer attribute"

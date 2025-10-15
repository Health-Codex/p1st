#!/bin/bash

# Simple script to add header-system.js to all pages
echo "=== ADDING HEADER-SYSTEM.JS (SIMPLE METHOD) ==="

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

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        # Add header-system.js before </body>
        sed -i '' 's|</body>|    <!-- Header System JavaScript -->\
    <script src="assets/js/header-system.js"></script>\
</body>|' "$file"
        echo "  ✅ Added header-system.js"
    fi
done

echo ""
echo "=== VERIFICATION ==="
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ] && grep -q "header-system.js" "$file"; then
        echo "✅ $file - header-system.js present"
    else
        echo "❌ $file - header-system.js missing"
    fi
done

#!/bin/bash

# CSS Duplication Detection and Fix Script
# Identifies and fixes duplicate CSS file references

echo "=== CSS DUPLICATION DETECTION ==="
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

echo "=== CHECKING FOR CSS DUPLICATIONS ==="
echo ""

files_with_duplicates=0

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file - FILE NOT FOUND"
        continue
    fi
    
    echo "📄 Checking: $file"
    
    # Check for duplicate custom-redesign.css
    custom_redesign_count=$(grep -c "custom-redesign.css" "$file")
    if [ "$custom_redesign_count" -gt 1 ]; then
        echo "  ⚠️  DUPLICATE: custom-redesign.css appears $custom_redesign_count times"
        files_with_duplicates=$((files_with_duplicates + 1))
    else
        echo "  ✅ custom-redesign.css: OK ($custom_redesign_count occurrence)"
    fi
    
    # Check for duplicate compact-layout.css
    compact_layout_count=$(grep -c "compact-layout.css" "$file")
    if [ "$compact_layout_count" -gt 1 ]; then
        echo "  ⚠️  DUPLICATE: compact-layout.css appears $compact_layout_count times"
        files_with_duplicates=$((files_with_duplicates + 1))
    else
        echo "  ✅ compact-layout.css: OK ($compact_layout_count occurrence)"
    fi
    
    # Check for duplicate advanced-effects.css
    advanced_effects_count=$(grep -c "advanced-effects.css" "$file")
    if [ "$advanced_effects_count" -gt 1 ]; then
        echo "  ⚠️  DUPLICATE: advanced-effects.css appears $advanced_effects_count times"
        files_with_duplicates=$((files_with_duplicates + 1))
    else
        echo "  ✅ advanced-effects.css: OK ($advanced_effects_count occurrence)"
    fi
    
    # Check for duplicate mobile-optimizations.css
    mobile_opt_count=$(grep -c "mobile-optimizations.css" "$file")
    if [ "$mobile_opt_count" -gt 1 ]; then
        echo "  ⚠️  DUPLICATE: mobile-optimizations.css appears $mobile_opt_count times"
        files_with_duplicates=$((files_with_duplicates + 1))
    else
        echo "  ✅ mobile-optimizations.css: OK ($mobile_opt_count occurrence)"
    fi
    
    # Check for duplicate header-system.css
    header_system_count=$(grep -c "header-system.css" "$file")
    if [ "$header_system_count" -gt 1 ]; then
        echo "  ⚠️  DUPLICATE: header-system.css appears $header_system_count times"
        files_with_duplicates=$((files_with_duplicates + 1))
    else
        echo "  ✅ header-system.css: OK ($header_system_count occurrence)"
    fi
    
    echo ""
done

echo "=== SUMMARY ==="
echo "Files with CSS duplications: $files_with_duplicates"
echo ""

if [ $files_with_duplicates -gt 0 ]; then
    echo "=== FILES NEEDING CSS DUPLICATION FIXES ==="
    for file in "${HTML_FILES[@]}"; do
        if [ -f "$file" ]; then
            # Check each CSS file for duplicates
            if [ $(grep -c "custom-redesign.css" "$file") -gt 1 ] || \
               [ $(grep -c "compact-layout.css" "$file") -gt 1 ] || \
               [ $(grep -c "advanced-effects.css" "$file") -gt 1 ] || \
               [ $(grep -c "mobile-optimizations.css" "$file") -gt 1 ] || \
               [ $(grep -c "header-system.css" "$file") -gt 1 ]; then
                echo "  - $file"
            fi
        fi
    done
else
    echo "🎉 No CSS duplications found!"
fi

echo ""
echo "=== CSS DUPLICATION CHECK COMPLETE ==="

#!/bin/bash

# HTML Structure and Accessibility Validation Script
# Checks for common HTML validation issues and accessibility problems

echo "=== HTML STRUCTURE AND ACCESSIBILITY VALIDATION ==="
echo "Generated on: $(date)"
echo ""

# Define the list of HTML files to validate
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
files_with_issues=0
files_with_proper_structure=0
files_with_accessibility_issues=0

echo "=== HTML STRUCTURE VALIDATION ==="
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file - FILE NOT FOUND"
        continue
    fi
    
    total_files=$((total_files + 1))
    echo "📄 Validating: $file"
    
    # Check for proper DOCTYPE
    if head -1 "$file" | grep -q "<!DOCTYPE html>"; then
        echo "  ✅ DOCTYPE: Proper HTML5 DOCTYPE found"
    else
        echo "  ❌ DOCTYPE: Missing or incorrect DOCTYPE"
        files_with_issues=$((files_with_issues + 1))
    fi
    
    # Check for proper header structure
    if grep -q '<header class="site-header">' "$file" && grep -q '</header>' "$file"; then
        echo "  ✅ Header structure: Proper header tags found"
        files_with_proper_structure=$((files_with_proper_structure + 1))
    else
        echo "  ❌ Header structure: Missing or malformed header tags"
        files_with_issues=$((files_with_issues + 1))
    fi
    
    # Check for main content structure
    if grep -q '<main' "$file"; then
        echo "  ✅ Main content: Main element found"
    else
        echo "  ❌ Main content: Missing main element"
        files_with_issues=$((files_with_issues + 1))
    fi
    
    # Check for proper navigation structure
    if grep -q '<nav' "$file"; then
        echo "  ✅ Navigation: Nav element found"
    else
        echo "  ❌ Navigation: Missing nav element"
        files_with_issues=$((files_with_issues + 1))
    fi
    
    # Check for accessibility attributes
    aria_issues=0
    
    # Check for aria-label on buttons
    if grep -q 'button.*aria-label' "$file"; then
        echo "  ✅ Accessibility: Button aria-labels found"
    else
        echo "  ⚠️  Accessibility: Missing button aria-labels"
        aria_issues=$((aria_issues + 1))
    fi
    
    # Check for alt text on images
    if grep -q 'img.*alt=' "$file"; then
        echo "  ✅ Accessibility: Image alt text found"
    else
        echo "  ❌ Accessibility: Missing image alt text"
        aria_issues=$((aria_issues + 1))
    fi
    
    # Check for skip links
    if grep -q 'skip-to-content' "$file" || grep -q 'Skip to content' "$file"; then
        echo "  ✅ Accessibility: Skip to content link found"
    else
        echo "  ❌ Accessibility: Missing skip to content link"
        aria_issues=$((aria_issues + 1))
    fi
    
    # Check for proper heading hierarchy
    h1_count=$(grep -c '<h1' "$file")
    if [ "$h1_count" -eq 1 ]; then
        echo "  ✅ Accessibility: Proper H1 usage (1 found)"
    elif [ "$h1_count" -eq 0 ]; then
        echo "  ❌ Accessibility: No H1 heading found"
        aria_issues=$((aria_issues + 1))
    else
        echo "  ⚠️  Accessibility: Multiple H1 headings found ($h1_count)"
        aria_issues=$((aria_issues + 1))
    fi
    
    # Check for lang attribute
    if grep -q '<html lang=' "$file"; then
        echo "  ✅ Accessibility: Language attribute found"
    else
        echo "  ❌ Accessibility: Missing language attribute"
        aria_issues=$((aria_issues + 1))
    fi
    
    if [ "$aria_issues" -gt 0 ]; then
        files_with_accessibility_issues=$((files_with_accessibility_issues + 1))
    fi
    
    echo ""
done

echo "=== VALIDATION SUMMARY ==="
echo "Total files validated: $total_files"
echo "Files with proper header structure: $files_with_proper_structure/$total_files"
echo "Files with HTML structure issues: $files_with_issues/$total_files"
echo "Files with accessibility issues: $files_with_accessibility_issues/$total_files"
echo ""

echo "=== CRITICAL ISSUES FOUND ==="

# Check for files with header tag issues
echo "Files with header structure issues:"
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        if ! (grep -q '<header class="site-header">' "$file" && grep -q '</header>' "$file"); then
            echo "  - $file"
        fi
    fi
done
echo ""

# Check for files missing main elements
echo "Files missing main element:"
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ] && ! grep -q '<main' "$file"; then
        echo "  - $file"
    fi
done
echo ""

# Check for files missing skip links
echo "Files missing skip to content links:"
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ] && ! (grep -q 'skip-to-content' "$file" || grep -q 'Skip to content' "$file"); then
        echo "  - $file"
    fi
done
echo ""

echo "=== RECOMMENDATIONS ==="
echo "1. Fix header tag structure on files with issues"
echo "2. Add missing main elements where needed"
echo "3. Implement skip to content links on all pages"
echo "4. Ensure proper aria-label attributes on interactive elements"
echo "5. Validate image alt text is descriptive and meaningful"
echo "6. Maintain proper heading hierarchy (single H1 per page)"
echo "7. Consider running full HTML5 validator for detailed validation"
echo ""

echo "=== VALIDATION COMPLETE ==="

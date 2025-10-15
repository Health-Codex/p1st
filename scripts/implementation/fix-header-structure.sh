#!/bin/bash

# Fix header HTML structure to match index.html template
# Adds mobile menu header and close button to all pages

echo "=== FIXING HEADER HTML STRUCTURE ==="
echo "Started at: $(date)"
echo ""

# Define the list of HTML files to update (excluding index.html which is already correct)
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

# Mobile menu header structure to add
MOBILE_MENU_HEADER='                    <!-- Mobile Menu Header -->
                    <div class="mobile-menu-header">
                        <div class="mobile-menu-logo">
                            <img src="assets/images/logo_peoplefirst-01.svg"
                                 alt="People First Urgent Care"
                                 width="auto"
                                 height="40">
                        </div>
                        <button class="mobile-menu-close" aria-label="Close navigation menu">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>

                    <!-- Navigation Menu -->'

files_updated=0
files_skipped=0

echo "Processing files..."
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file - FILE NOT FOUND, skipping..."
        files_skipped=$((files_skipped + 1))
        continue
    fi
    
    # Check if mobile-menu-header already exists
    if grep -q "mobile-menu-header" "$file"; then
        echo "✅ $file - mobile-menu-header already present, skipping..."
        files_skipped=$((files_skipped + 1))
        continue
    fi
    
    echo "🔧 Processing: $file"
    
    # Create backup
    cp "$file" "$file.bak.header-$(date +%Y%m%d-%H%M%S)"
    
    # Method 1: Look for the pattern where we have mobile-menu-logo directly under nav
    if grep -q '<div class="mobile-menu-logo">' "$file"; then
        echo "  🔧 Found old mobile-menu-logo structure, replacing..."
        
        # Remove the old mobile-menu-logo div and replace with proper structure
        # First, find the line number of the mobile-menu-logo
        logo_line=$(grep -n '<div class="mobile-menu-logo">' "$file" | cut -d: -f1)
        
        if [ ! -z "$logo_line" ]; then
            # Remove the old mobile-menu-logo structure (3 lines typically)
            sed -i '' "${logo_line},$((logo_line + 2))d" "$file"
            
            # Insert the new mobile menu header structure at the same location
            sed -i '' "${logo_line}i\\
$MOBILE_MENU_HEADER
" "$file"
            
            echo "  ✅ Replaced old mobile-menu-logo with proper mobile-menu-header structure"
            files_updated=$((files_updated + 1))
        else
            echo "  ❌ Could not find mobile-menu-logo line number"
        fi
    else
        # Method 2: Look for nav tag and add after it
        if grep -q '<nav class="main-navigation"' "$file"; then
            echo "  🔧 Adding mobile-menu-header after nav tag..."
            
            # Add mobile menu header after the nav opening tag
            sed -i '' '/<nav class="main-navigation"/a\
'"$MOBILE_MENU_HEADER"'
' "$file"
            
            echo "  ✅ Added mobile-menu-header structure"
            files_updated=$((files_updated + 1))
        else
            echo "  ❌ Could not find nav tag in $file"
        fi
    fi
    
    echo ""
done

echo "=== SUMMARY ==="
echo "Files updated: $files_updated"
echo "Files skipped: $files_skipped"
echo "Total files processed: $((files_updated + files_skipped))"
echo ""

echo "=== VERIFICATION ==="
echo "Checking that mobile-menu-header was added correctly..."
echo ""

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "mobile-menu-header" "$file"; then
            echo "✅ $file - mobile-menu-header present"
        else
            echo "❌ $file - mobile-menu-header still missing"
        fi
        
        if grep -q "mobile-menu-close" "$file"; then
            echo "✅ $file - mobile-menu-close button present"
        else
            echo "❌ $file - mobile-menu-close button still missing"
        fi
    fi
done

echo ""
echo "=== HEADER STRUCTURE FIX COMPLETE ==="
echo "Completed at: $(date)"

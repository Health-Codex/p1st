#!/bin/bash

# This script fixes the layout issues by directly modifying the HTML files
# to properly close the header tag before the main tag

# List of HTML files to fix
HTML_FILES=(
  "allergy-testing.html"
  "dashboard.html"
  "gallery.html"
  "insurance.html"
  "our-staff.html"
  "patient-services.html"
  "pay.html"
  "physicals.html"
  "primary-care.html"
  "save-your-spot.html"
  "services.html"
  "telemedicine.html"
  "testimonials.html"
  "urgent-care.html"
  "vaccinations.html"
  "weight-loss.html"
  "x-ray.html"
)

# Process each HTML file
for file in "${HTML_FILES[@]}"; do
  echo "Processing $file..."
  
  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "File $file not found, skipping..."
    continue
  fi
  
  # Create a backup of the original file
  cp "$file" "$file.bak.header"
  
  # Use perl to fix the file - this pattern looks for the end of the header div
  # and adds the closing header tag before the main tag
  perl -i -pe 's/(<\/div>\s*<\/div>\s*<\/div>)\s*(<main)/$1\n<\/header>\n\n$2/g' "$file"
  
  echo "Fixed $file"
done

echo "Layout fix complete!"

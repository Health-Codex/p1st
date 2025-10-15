#!/bin/bash

# This script fixes the layout issues by directly modifying the HTML files
# to move the main tag outside of the header tag

# List of HTML files to fix
HTML_FILES=(
  "allergy-testing.html"
  "dashboard.html"
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
  cp "$file" "$file.bak.fix3"
  
  # Use sed to fix the file
  sed -i '' 's/<\/div>\s*<main/<\/div>\n<\/header>\n\n<main/g' "$file"
  
  echo "Fixed $file"
done

echo "Layout fix complete!"

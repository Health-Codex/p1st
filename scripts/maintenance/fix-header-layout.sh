#!/bin/bash

# This script fixes the layout issues caused by the standardization script
# by ensuring the main content is properly separated from the header

# List of HTML files to fix
HTML_FILES=(
  "about.html"
  "allergy-testing.html"
  "bartlett.html"
  "collierville.html"
  "contact.html"
  "covid-19-testing.html"
  "dashboard.html"
  "gallery.html"
  "germantown.html"
  "insurance.html"
  "lab-testing.html"
  "millington.html"
  "our-staff.html"
  "patient-services.html"
  "pay.html"
  "physicals.html"
  "primary-care.html"
  "save-your-spot.html"
  "services.html"
  "southaven.html"
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
  cp "$file" "$file.bak.fix"
  
  # Check if the main tag is inside the header tag
  if grep -q '<header class="site-header">.*<main' "$file" -s; then
    echo "Found main tag inside header in $file, fixing..."
    
    # Extract the content before the header
    before_header=$(sed -n '1,/<header class="site-header">/p' "$file" | sed '$d')
    
    # Extract the header content
    header_content=$(sed -n '/<header class="site-header">/,/<\/header>/p' "$file" | grep -v '<main')
    
    # Extract the main content and everything after it
    main_content=$(sed -n '/<main/,$p' "$file")
    
    # Combine the parts correctly
    {
      echo "$before_header"
      echo "$header_content"
      echo "$main_content"
    } > "$file"
    
    echo "Fixed $file"
  else
    echo "No layout issues found in $file, skipping..."
  fi
done

echo "Layout fix complete!"

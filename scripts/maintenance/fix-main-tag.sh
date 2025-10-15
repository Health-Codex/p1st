#!/bin/bash

# This script fixes the layout issues by moving the main tag outside of the header tag

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
  cp "$file" "$file.bak.fix2"
  
  # Check if the main tag is inside the header tag
  if grep -q '<main' "$file" && grep -q '</header>' "$file"; then
    # Get the line numbers
    main_start_line=$(grep -n '<main' "$file" | head -1 | cut -d':' -f1)
    header_end_line=$(grep -n '</header>' "$file" | head -1 | cut -d':' -f1)
    
    if [ "$main_start_line" -lt "$header_end_line" ]; then
      echo "Found main tag inside header in $file, fixing..."
      
      # Extract the content before the header
      before_header=$(sed -n '1,/<header class="site-header">/p' "$file" | sed '$d')
      
      # Extract the header content without the main tag
      header_content=$(sed -n '/<header class="site-header">/,/<main/p' "$file" | sed '$d')
      
      # Add the closing header tag
      header_content="${header_content}\n</header>"
      
      # Extract the main content and everything after it
      main_content=$(sed -n '/<main/,$p' "$file")
      
      # Combine the parts correctly
      {
        echo "$before_header"
        echo -e "$header_content"
        echo "$main_content"
      } > "$file"
      
      echo "Fixed $file"
    else
      echo "Main tag is already outside header in $file, skipping..."
    fi
  else
    echo "Could not find both main and header tags in $file, skipping..."
  fi
done

echo "Layout fix complete!"

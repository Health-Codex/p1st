#!/bin/bash

# This script updates the navigation menu across all HTML files

# Define the standard navigation menu
STANDARD_NAV=$(cat standard-navigation.html)

# List of main HTML files to update
HTML_FILES=(
  "urgent-care.html"
  "lab-testing.html"
  "vaccinations.html"
  "physicals.html"
  "covid-19-testing.html"
  "primary-care.html"
  "telemedicine.html"
  "x-ray.html"
  "allergy-testing.html"
  "weight-loss.html"
  "occupational-health.html"
  "cardiology.html"
  "collierville.html"
  "southaven.html"
  "millington.html"
  "germantown.html"
  "bartlett.html"
  "gallery.html"
  "pay.html"
  "save-your-spot.html"
  "insurance.html"
  "contact.html"
  "services.html"
  "testimonials.html"
  "dashboard.html"
)

# Function to update the current-menu-item class based on the filename
update_current_menu_item() {
  local file=$1
  local filename=$(basename "$file")
  local content=$2
  
  # Remove all current-menu-item classes first
  content=$(echo "$content" | sed 's/class="current-menu-item"//g' | sed 's/class="menu-item-has-children current-menu-item"/class="menu-item-has-children"/g')
  
  # Add current-menu-item class based on the filename
  case "$filename" in
    "index.html"|"index-redesign.html")
      content=$(echo "$content" | sed 's/<li><a href="index.html">Home<\/a><\/li>/<li class="current-menu-item"><a href="index.html">Home<\/a><\/li>/g')
      ;;
    "about.html")
      content=$(echo "$content" | sed 's/<li><a href="about.html">About Us<\/a><\/li>/<li class="current-menu-item"><a href="about.html">About Us<\/a><\/li>/g')
      ;;
    "our-staff.html")
      content=$(echo "$content" | sed 's/<li><a href="our-staff.html">Our Staff<\/a><\/li>/<li class="current-menu-item"><a href="our-staff.html">Our Staff<\/a><\/li>/g')
      ;;
    "patient-services.html")
      content=$(echo "$content" | sed 's/<li class="menu-item-has-children">/<li class="menu-item-has-children current-menu-item">/g')
      ;;
    "telemedicine.html")
      content=$(echo "$content" | sed 's/<li><a href="telemedicine.html">Telemedicine<\/a><\/li>/<li class="current-menu-item"><a href="telemedicine.html">Telemedicine<\/a><\/li>/g')
      ;;
    "insurance.html")
      content=$(echo "$content" | sed 's/<li><a href="insurance.html">Insurance<\/a><\/li>/<li class="current-menu-item"><a href="insurance.html">Insurance<\/a><\/li>/g')
      ;;
    "contact.html")
      content=$(echo "$content" | sed 's/<li class="menu-item-has-children">\\n            <a href="contact.html">Locations<\/a>/<li class="menu-item-has-children current-menu-item">\\n            <a href="contact.html">Locations<\/a>/g')
      ;;
    "gallery.html")
      content=$(echo "$content" | sed 's/<li><a href="gallery.html">Gallery<\/a><\/li>/<li class="current-menu-item"><a href="gallery.html">Gallery<\/a><\/li>/g')
      ;;
    "pay.html")
      content=$(echo "$content" | sed 's/<li class="accent-button"><a href="pay.html">/<li class="accent-button current-menu-item"><a href="pay.html">/g')
      ;;
    "save-your-spot.html")
      content=$(echo "$content" | sed 's/<li class="cta-button"><a href="save-your-spot.html">/<li class="cta-button current-menu-item"><a href="save-your-spot.html">/g')
      ;;
    *)
      # For other pages like lab-testing.html, x-ray.html, etc., mark the Patient Services as current
      if [[ "$filename" == "lab-testing.html" || "$filename" == "x-ray.html" || "$filename" == "vaccinations.html" || "$filename" == "physicals.html" || "$filename" == "covid-19-testing.html" || "$filename" == "urgent-care.html" || "$filename" == "primary-care.html" ]]; then
        content=$(echo "$content" | sed 's/<li class="menu-item-has-children">\\n            <a href="patient-services.html">Patient Services<\/a>/<li class="menu-item-has-children current-menu-item">\\n            <a href="patient-services.html">Patient Services<\/a>/g')
      fi
      ;;
  esac
  
  echo "$content"
}

# Process each HTML file
for file in "${HTML_FILES[@]}"; do
  echo "Processing $file..."
  
  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "File $file not found, skipping..."
    continue
  fi
  
  # Create a backup of the original file
  cp "$file" "$file.bak"
  
  # Get the content of the file
  content=$(cat "$file")
  
  # Find the navigation section and replace it
  if grep -q '<nav class="main-navigation"' "$file"; then
    # Extract the content before the navigation
    before_nav=$(sed -n '1,/<nav class="main-navigation"/p' "$file" | sed '$d')
    
    # Extract the content after the navigation
    after_nav=$(sed -n '/<\/nav>/,$p' "$file" | sed '1d')
    
    # Update the current-menu-item class
    updated_nav=$(update_current_menu_item "$file" "$STANDARD_NAV")
    
    # Combine the parts
    echo "$before_nav" > "$file"
    echo "$updated_nav" >> "$file"
    echo "$after_nav" >> "$file"
    
    echo "Updated $file"
  else
    echo "No navigation found in $file, skipping..."
  fi
done

echo "Navigation menu standardization complete!"

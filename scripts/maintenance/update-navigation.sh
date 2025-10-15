#!/bin/bash

# This script updates the navigation menu across all HTML files

# Define the standard navigation menu
STANDARD_NAV='<nav class="main-navigation" aria-label="Main Navigation">
                    <div class="mobile-menu-logo">
                        <img src="images/logo_peoplefirst-01.svg" alt="People First Urgent Care">
                    </div>
                    <ul class="menu">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="our-staff.html">Our Staff</a></li>
                        <li class="menu-item-has-children">
                            <a href="patient-services.html">Patient Services</a>
                            <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle patient services submenu">
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <ul class="sub-menu">
                                <li><a href="lab-testing.html">Laboratory Testing</a></li>
                                <li><a href="x-ray.html">X-Ray & Imaging</a></li>
                                <li><a href="vaccinations.html">Vaccinations</a></li>
                                <li><a href="physicals.html">Physicals</a></li>
                                <li><a href="covid-19-testing.html">COVID-19 Testing</a></li>
                                <li><a href="urgent-care.html">Urgent Care</a></li>
                                <li><a href="primary-care.html">Primary Care</a></li>
                                <li><a href="telemedicine.html">Telemedicine</a></li>
                            </ul>
                        </li>
                        <li><a href="telemedicine.html">Telemedicine</a></li>
                        <li><a href="insurance.html">Insurance</a></li>
                        <li class="menu-item-has-children">
                            <a href="contact.html">Locations</a>
                            <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle locations submenu">
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <ul class="sub-menu">
                                <li><a href="collierville.html">Collierville</a></li>
                                <li><a href="southaven.html">Southaven</a></li>
                                <li><a href="millington.html">Millington</a></li>
                                <li><a href="germantown.html">Germantown</a></li>
                                <li><a href="bartlett.html">Bartlett</a></li>
                            </ul>
                        </li>
                        <li><a href="gallery.html">Gallery</a></li>
                        <li class="accent-button"><a href="pay.html"><i class="fa-solid fa-credit-card"></i> Pay Now</a></li>
                        <li class="cta-button"><a href="save-your-spot.html"><i class="fa-solid fa-calendar-check"></i> Save Your Spot</a></li>
                    </ul>
                </nav>'

# List of main HTML files to update
HTML_FILES=(
  "about.html"
  "allergy-testing.html"
  "contact.html"
  "dashboard.html"
  "gallery.html"
  "index-redesign.html"
  "index.html"
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
      content=$(echo "$content" | sed 's/<li class="menu-item-has-children">\\n                            <a href="contact.html">Locations<\/a>/<li class="menu-item-has-children current-menu-item">\\n                            <a href="contact.html">Locations<\/a>/g')
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
        content=$(echo "$content" | sed 's/<li class="menu-item-has-children">\\n                            <a href="patient-services.html">Patient Services<\/a>/<li class="menu-item-has-children current-menu-item">\\n                            <a href="patient-services.html">Patient Services<\/a>/g')
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
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Find the navigation section and replace it
  awk -v nav="$STANDARD_NAV" '
    /<nav class="main-navigation"/ {
      in_nav = 1
      print nav
      next
    }
    in_nav && /<\/nav>/ {
      in_nav = 0
      next
    }
    !in_nav {
      print
    }
  ' "$file" > "$temp_file"
  
  # Update the current-menu-item class
  updated_content=$(update_current_menu_item "$file" "$(cat "$temp_file")")
  echo "$updated_content" > "$temp_file"
  
  # Replace the original file
  mv "$temp_file" "$file"
  
  echo "Updated $file"
done

echo "Navigation menu standardization complete!"

#!/bin/bash

# This script standardizes the header (navigation menu and logo) across all HTML files
# to match the home page implementation

# Define the standard header
STANDARD_HEADER=$(cat standard-header.html)

# List of HTML files to update
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

# Function to update the current-menu-item class based on the filename
update_current_menu_item() {
  local file=$1
  local filename=$(basename "$file")
  local content=$2

  # Remove all current-menu-item classes first
  content=$(echo "$content" | sed 's/class="current-menu-item"//g' | sed 's/class="menu-item-has-children current-menu-item"/class="menu-item-has-children"/g')

  # Add current-menu-item class based on the filename
  case "$filename" in
    "index.html")
      content=$(echo "$content" | sed 's/<li><a href="index.html">Home<\/a><\/li>/<li class="current-menu-item"><a href="index.html">Home<\/a><\/li>/g')
      ;;
    "about.html")
      content=$(echo "$content" | sed 's/<li><a href="about.html">About Us<\/a><\/li>/<li class="current-menu-item"><a href="about.html">About Us<\/a><\/li>/g')
      ;;
    "our-staff.html")
      content=$(echo "$content" | sed 's/<li><a href="our-staff.html">Our Staff<\/a><\/li>/<li class="current-menu-item"><a href="our-staff.html">Our Staff<\/a><\/li>/g')
      ;;
    "telemedicine.html")
      content=$(echo "$content" | sed 's/<li><a href="telemedicine.html">Telemedicine<\/a><\/li>/<li class="current-menu-item"><a href="telemedicine.html">Telemedicine<\/a><\/li>/g')
      ;;
    "insurance.html")
      content=$(echo "$content" | sed 's/<li><a href="insurance.html">Insurance<\/a><\/li>/<li class="current-menu-item"><a href="insurance.html">Insurance<\/a><\/li>/g')
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
    "contact.html"|"collierville.html"|"southaven.html"|"millington.html"|"germantown.html"|"bartlett.html")
      content=$(echo "$content" | sed 's/<li class="menu-item-has-children">\\n                    <a href="contact.html">Locations<\/a>/<li class="menu-item-has-children current-menu-item">\\n                    <a href="contact.html">Locations<\/a>/g')
      ;;
    *)
      # For other pages like lab-testing.html, x-ray.html, etc., mark the Patient Services as current
      if [[ "$filename" == "lab-testing.html" || "$filename" == "x-ray.html" || "$filename" == "vaccinations.html" || "$filename" == "physicals.html" || "$filename" == "covid-19-testing.html" || "$filename" == "urgent-care.html" || "$filename" == "primary-care.html" || "$filename" == "patient-services.html" || "$filename" == "allergy-testing.html" || "$filename" == "weight-loss.html" ]]; then
        content=$(echo "$content" | sed 's/<li class="menu-item-has-children">\\n                    <a href="patient-services.html">Patient Services<\/a>/<li class="menu-item-has-children current-menu-item">\\n                    <a href="patient-services.html">Patient Services<\/a>/g')
      fi
      ;;
  esac

  echo "$content"
}

# Function to ensure CSS files are consistent
ensure_css_files() {
  local file=$1
  local content=$2

  # Check if the file already includes custom-redesign.css
  if ! echo "$content" | grep -q "custom-redesign.css"; then
    # Replace custom.css with custom-redesign.css
    content=$(echo "$content" | sed 's/<link rel="stylesheet" href="css\/custom.css">/<link rel="stylesheet" href="css\/custom-redesign.css">/g')

    # Add additional CSS files if they don't exist
    if ! echo "$content" | grep -q "compact-layout.css"; then
      content=$(echo "$content" | sed 's/<link rel="stylesheet" href="css\/custom-redesign.css">/<link rel="stylesheet" href="css\/custom-redesign.css">\n    <link rel="stylesheet" href="css\/compact-layout.css">/g')
    fi

    if ! echo "$content" | grep -q "advanced-effects.css"; then
      content=$(echo "$content" | sed 's/<link rel="stylesheet" href="css\/compact-layout.css">/<link rel="stylesheet" href="css\/compact-layout.css">\n    <link rel="stylesheet" href="css\/advanced-effects.css">/g')
    fi
  fi

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

  # Find the header section and replace it
  if grep -q '<header class="site-header">' "$file"; then
    # Extract the content before the header
    before_header=$(sed -n '1,/<header class="site-header">/p' "$file" | sed '$d')

    # Extract the content after the header
    after_header=$(sed -n '/<\/header>/,$p' "$file" | sed '1d')

    # Ensure CSS files are consistent
    before_header=$(ensure_css_files "$file" "$before_header")

    # Create the new header with the current-menu-item class
    new_header="<header class=\"site-header\">\n    <!-- Top Bar -->\n    <div class=\"top-bar\">\n        <div class=\"container\">\n            <div class=\"top-bar-content\">\n                <div class=\"top-bar-info\">\n                    <span>Questions? <a href=\"tel:901-473-0582\">901-473-0582</a></span>\n                    <span><a href=\"mailto:info@peoplefirstcare.com\">info@peoplefirstcare.com</a></span>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Mobile Menu Overlay -->\n    <div class=\"mobile-menu-overlay\"></div>\n\n    <div class=\"container\">\n        <div class=\"header-inner\">\n            <div class=\"logo\">\n                <a href=\"index.html\">\n                    <img src=\"images/logo_peoplefirst-01.svg\" alt=\"People First Urgent Care Logo\" width=\"auto\" height=\"50\" style=\"min-height: 50px;\">\n                </a>\n            </div>\n            <nav class=\"main-navigation\" aria-label=\"Main Navigation\">\n                <div class=\"mobile-menu-logo\">\n                    <img src=\"images/logo_peoplefirst-01.svg\" alt=\"People First Urgent Care\">\n                </div>\n                <ul class=\"menu\">\n                    <li><a href=\"index.html\">Home</a></li>\n                    <li><a href=\"about.html\">About Us</a></li>\n                    <li><a href=\"our-staff.html\">Our Staff</a></li>\n                    <li class=\"menu-item-has-children\">\n                        <a href=\"patient-services.html\">Patient Services</a>\n                        <button class=\"submenu-toggle\" aria-expanded=\"false\" aria-label=\"Toggle patient services submenu\">\n                            <i class=\"fa-solid fa-chevron-down\"></i>\n                        </button>\n                        <ul class=\"sub-menu\">\n                            <li><a href=\"lab-testing.html\">Laboratory Testing</a></li>\n                            <li><a href=\"x-ray.html\">X-Ray & Imaging</a></li>\n                            <li><a href=\"vaccinations.html\">Vaccinations</a></li>\n                            <li><a href=\"physicals.html\">Physicals</a></li>\n                            <li><a href=\"covid-19-testing.html\">COVID-19 Testing</a></li>\n                            <li><a href=\"urgent-care.html\">Urgent Care</a></li>\n                            <li><a href=\"primary-care.html\">Primary Care</a></li>\n                            <li><a href=\"telemedicine.html\">Telemedicine</a></li>\n                        </ul>\n                    </li>\n                    <li><a href=\"telemedicine.html\">Telemedicine</a></li>\n                    <li><a href=\"insurance.html\">Insurance</a></li>\n                    <li class=\"menu-item-has-children\">\n                        <a href=\"contact.html\">Locations</a>\n                        <button class=\"submenu-toggle\" aria-expanded=\"false\" aria-label=\"Toggle locations submenu\">\n                            <i class=\"fa-solid fa-chevron-down\"></i>\n                        </button>\n                        <ul class=\"sub-menu\">\n                            <li><a href=\"collierville.html\">Collierville</a></li>\n                            <li><a href=\"southaven.html\">Southaven</a></li>\n                            <li><a href=\"millington.html\">Millington</a></li>\n                            <li><a href=\"germantown.html\">Germantown</a></li>\n                            <li><a href=\"bartlett.html\">Bartlett</a></li>\n                        </ul>\n                    </li>\n                    <li><a href=\"gallery.html\">Gallery</a></li>\n                    <li class=\"accent-button\"><a href=\"pay.html\"><i class=\"fa-solid fa-credit-card\"></i> Pay Now</a></li>\n                    <li class=\"cta-button\"><a href=\"save-your-spot.html\"><i class=\"fa-solid fa-calendar-check\"></i> Save Your Spot</a></li>\n                </ul>\n            </nav>\n            <div class=\"header-actions\">\n                <button class=\"mobile-menu-toggle\" aria-expanded=\"false\" aria-label=\"Toggle navigation menu\">\n                    <i class=\"fa-solid fa-bars\"></i>\n                </button>\n            </div>\n        </div>\n    </div>"
    updated_header=$(update_current_menu_item "$file" "$new_header")

    # Combine the parts
    echo "$before_header" > "$file"
    echo -e "$updated_header" >> "$file"
    echo "$after_header" >> "$file"

    echo "Updated $file"
  else
    echo "No header found in $file, skipping..."
  fi
done

echo "Header standardization complete!"

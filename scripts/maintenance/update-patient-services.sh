#!/bin/bash

# This script updates the Patient Services dropdown menu in all HTML files

# Find all HTML files
HTML_FILES=$(find . -name "*.html" -not -path "./index.html" -not -path "./our-staff.html" -not -path "./contact.html")

# Loop through each HTML file
for file in $HTML_FILES; do
  echo "Processing $file..."
  
  # Check if the file contains the Patient Services dropdown menu
  if grep -q "patient-services.html" "$file"; then
    echo "Updating Patient Services dropdown menu in $file..."
    
    # Use sed to replace the old dropdown menu with the new one
    sed -i '' -e '/<li class="menu-item-has-children">/,/<\/li>/ {
      /<a href="patient-services.html">Patient Services<\/a>/,/<\/ul>/ {
        /<ul class="sub-menu">/,/<\/ul>/ {
          /<\/ul>/!d
          s/<\/ul>/<li><a href="lab-testing.html">Laboratory Testing<\/a><\/li>\
                                <li><a href="x-ray.html">X-Ray \& Imaging<\/a><\/li>\
                                <li><a href="vaccinations.html">Vaccinations<\/a><\/li>\
                                <li><a href="physicals.html">Physicals<\/a><\/li>\
                                <li><a href="covid-19-testing.html">COVID-19 Testing<\/a><\/li>\
                                <li><a href="urgent-care.html">Urgent Care<\/a><\/li>\
                                <li><a href="primary-care.html">Primary Care<\/a><\/li>\
                                <li><a href="telemedicine.html">Telemedicine<\/a><\/li>\
                            <\/ul>/
        }
      }
    }' "$file"
    
    echo "Updated $file"
  else
    echo "No Patient Services dropdown menu found in $file, skipping..."
  fi
done

echo "All files processed!"

#!/bin/bash

# This script adds the fixed Save Your Spot button to all HTML files

# Find all HTML files
HTML_FILES=$(find . -name "*.html" -not -path "*/\.*")

# Loop through each HTML file
for file in $HTML_FILES; do
  echo "Processing $file..."
  
  # Check if the file already has the fixed CTA button
  if grep -q "fixed-cta-button" "$file"; then
    echo "  Fixed CTA button already exists in $file, skipping..."
    continue
  fi
  
  # Check if the file has a back-to-top button
  if grep -q "id=\"back-to-top\"" "$file"; then
    # Add the fixed CTA button after the back-to-top button
    sed -i '' 's/<a href="#" id="back-to-top" aria-label="Back to top"><i class="fa-solid fa-arrow-up"><\/i><\/a>/<a href="#" id="back-to-top" aria-label="Back to top"><i class="fa-solid fa-arrow-up"><\/i><\/a>\n\n    <!-- Fixed Save Your Spot Button for Mobile -->\n    <a href="save-your-spot.html" class="fixed-cta-button">\n        <i class="fa-solid fa-calendar-check"><\/i> Save Your Spot\n    <\/a>/' "$file"
    echo "  Added fixed CTA button after back-to-top button in $file"
  else
    # Check if the file has a footer
    if grep -q "<\/footer>" "$file"; then
      # Add the fixed CTA button after the footer
      sed -i '' 's/<\/footer>/<\/footer>\n\n    <!-- Fixed Save Your Spot Button for Mobile -->\n    <a href="save-your-spot.html" class="fixed-cta-button">\n        <i class="fa-solid fa-calendar-check"><\/i> Save Your Spot\n    <\/a>/' "$file"
      echo "  Added fixed CTA button after footer in $file"
    else
      # Add the fixed CTA button before the closing body tag
      sed -i '' 's/<\/body>/<\!-- Fixed Save Your Spot Button for Mobile -->\n    <a href="save-your-spot.html" class="fixed-cta-button">\n        <i class="fa-solid fa-calendar-check"><\/i> Save Your Spot\n    <\/a>\n\n<\/body>/' "$file"
      echo "  Added fixed CTA button before closing body tag in $file"
    fi
  fi
done

echo "Done! Fixed CTA button added to all HTML files."

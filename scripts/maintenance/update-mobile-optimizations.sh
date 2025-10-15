#!/bin/bash

# This script updates all HTML files to include mobile optimization CSS and JS files

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
  "index.html"
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
  cp "$file" "$file.bak.mobile"

  # Add mobile-optimizations.css if not already present
  if ! grep -q "mobile-optimizations.css" "$file"; then
    # Try different patterns to find a place to add the CSS
    if grep -q "healthcare-cta-green.css" "$file"; then
      sed -i '' 's/\(.*healthcare-cta-green.css.*\)/\1\n    <link rel="stylesheet" href="css\/mobile-optimizations.css">/' "$file"
    elif grep -q "custom-redesign.css" "$file"; then
      sed -i '' 's/\(.*custom-redesign.css.*\)/\1\n    <link rel="stylesheet" href="css\/mobile-optimizations.css">/' "$file"
    elif grep -q "custom.css" "$file"; then
      sed -i '' 's/\(.*custom.css.*\)/\1\n    <link rel="stylesheet" href="css\/mobile-optimizations.css">/' "$file"
    elif grep -q "<\/head>" "$file"; then
      sed -i '' 's/\(.*<\/head>.*\)/    <link rel="stylesheet" href="css\/mobile-optimizations.css">\n\1/' "$file"
    fi
    echo "Added mobile-optimizations.css to $file"
  else
    echo "mobile-optimizations.css already exists in $file"
  fi

  # Add mobile-enhancements.js if not already present
  if ! grep -q "mobile-enhancements.js" "$file"; then
    # Try different patterns to find a place to add the JS
    if grep -q "mobile-optimizations.js" "$file"; then
      sed -i '' 's/\(.*mobile-optimizations.js.*\)/\1\n    <script src="js\/mobile-enhancements.js"><\/script>/' "$file"
    elif grep -q "custom.js" "$file"; then
      sed -i '' 's/\(.*custom.js.*\)/\1\n    <script src="js\/mobile-enhancements.js"><\/script>/' "$file"
    elif grep -q "main.js" "$file"; then
      sed -i '' 's/\(.*main.js.*\)/\1\n    <script src="js\/mobile-enhancements.js"><\/script>/' "$file"
    elif grep -q "<\/body>" "$file"; then
      sed -i '' 's/\(.*<\/body>.*\)/    <script src="js\/mobile-enhancements.js"><\/script>\n\1/' "$file"
    fi
    echo "Added mobile-enhancements.js to $file"
  else
    echo "mobile-enhancements.js already exists in $file"
  fi

  # Update viewport meta tag to ensure proper mobile rendering
  if grep -q '<meta name="viewport"' "$file"; then
    # Update existing viewport meta tag
    sed -i '' 's/<meta name="viewport".*>/<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">/' "$file"
    echo "Updated viewport meta tag in $file"
  else
    # Add viewport meta tag if it doesn't exist
    sed -i '' 's/<meta charset="UTF-8">/<meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">/' "$file"
    echo "Added viewport meta tag to $file"
  fi

  echo "Completed processing $file"
  echo "------------------------"
done

echo "Mobile optimization update complete!"

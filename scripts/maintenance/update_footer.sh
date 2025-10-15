#!/bin/bash

# Find all HTML files
html_files=$(find . -name "*.html" -not -path "./design/*")

# Loop through each file
for file in $html_files; do
  # Check if the file contains the footer-shape-divider
  if grep -q "footer-shape-divider" "$file"; then
    echo "Updating $file..."
    
    # Use sed to replace the footer-shape-divider section
    sed -i '' '/<footer class="site-footer">/,/<\/div>/ {
      /<footer class="site-footer">/b
      /<div class="footer-top">/b
      d
    }' "$file"
    
    echo "Updated $file"
  fi
done

echo "All files updated!"

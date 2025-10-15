#!/bin/bash

# Find all HTML files
html_files=$(find . -name "*.html")

# Search for the X button in each file
for file in $html_files; do
  if grep -q "mobile-menu-close" "$file"; then
    echo "Found X button in: $file"
  fi
done

#!/bin/bash

# Find all HTML files
html_files=$(find . -name "*.html")

# Search for the profile button in each file
for file in $html_files; do
  if grep -q "header-icon.*fa-user-circle" "$file"; then
    echo "Found profile button in: $file"
  fi
done

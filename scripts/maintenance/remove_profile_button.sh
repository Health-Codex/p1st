#!/bin/bash

# Find all HTML files
html_files=$(find . -name "*.html")

# Process each file
for file in $html_files; do
  # Skip files that don't exist
  if [ ! -f "$file" ]; then
    continue
  fi
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Process the file and write to temporary file
  awk '
  {
    # Skip the profile button lines
    if ($0 ~ /<a href="dashboard.html" class="header-icon"/ || 
        (prev_line ~ /<a href="dashboard.html" class="header-icon"/ && $0 ~ /<i class="fa-solid fa-user-circle"><\/i>/) ||
        (prev_prev_line ~ /<a href="dashboard.html" class="header-icon"/ && prev_line ~ /<i class="fa-solid fa-user-circle"><\/i>/ && $0 ~ /<\/a>/)) {
      # Skip this line
    } else {
      # Print the line
      print $0
    }
    
    # Store previous lines for context
    prev_prev_line = prev_line
    prev_line = $0
  }
  ' "$file" > "$temp_file"
  
  # Replace the original file with the modified one
  mv "$temp_file" "$file"
  
  echo "Processed $file"
done

echo "Profile button removal complete!"

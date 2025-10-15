#!/usr/bin/env python3

"""
CSS Duplication Fix Script
Removes duplicate CSS file references from HTML files
"""

import os
import re
from datetime import datetime

# List of files that need CSS duplication fixes
FILES_TO_FIX = [
    "allergy-testing.html",
    "contact.html", 
    "gallery.html",
    "insurance.html",
    "lab-testing.html",
    "our-staff.html",
    "patient-services.html",
    "pay.html",
    "physicals.html",
    "primary-care.html",
    "save-your-spot.html",
    "services.html",
    "telemedicine.html",
    "urgent-care.html",
    "vaccinations.html",
    "weight-loss.html",
    "x-ray.html"
]

def remove_duplicate_css_lines(content, css_filename):
    """Remove duplicate CSS link lines for a specific CSS file"""
    
    # Pattern to match CSS link lines for the specific file
    pattern = rf'<link[^>]*href="[^"]*{re.escape(css_filename)}"[^>]*>'
    
    # Find all matches
    matches = re.findall(pattern, content)
    
    if len(matches) <= 1:
        return content, 0  # No duplicates
    
    # Keep only the first occurrence, remove the rest
    first_match = matches[0]
    
    # Replace all occurrences with empty string
    content_without_css = re.sub(pattern, '', content)
    
    # Add back the first occurrence at the appropriate location
    # Look for a good place to insert it (after other CSS files)
    if 'custom-redesign.css' in css_filename:
        # Insert after Font Awesome or at the beginning of head section
        if 'font-awesome' in content_without_css:
            content_without_css = re.sub(
                r'(<link[^>]*font-awesome[^>]*>)',
                r'\1\n    ' + first_match,
                content_without_css,
                count=1
            )
        else:
            # Insert after <head> tag
            content_without_css = re.sub(
                r'(<head[^>]*>)',
                r'\1\n    ' + first_match,
                content_without_css,
                count=1
            )
    elif 'header-system.css' in css_filename:
        # Insert after custom-redesign.css
        if 'custom-redesign.css' in content_without_css:
            content_without_css = re.sub(
                r'(<link[^>]*custom-redesign\.css[^>]*>)',
                r'\1\n    ' + first_match,
                content_without_css,
                count=1
            )
        else:
            # Insert after <head> tag
            content_without_css = re.sub(
                r'(<head[^>]*>)',
                r'\1\n    ' + first_match,
                content_without_css,
                count=1
            )
    
    return content_without_css, len(matches) - 1

def fix_file_duplications(filename):
    """Fix CSS duplications in a single file"""
    
    if not os.path.exists(filename):
        print(f"❌ {filename} - FILE NOT FOUND")
        return False
    
    print(f"🔧 Processing: {filename}")
    
    # Read file content
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_filename = f"{filename}.bak.css-fix-{timestamp}"
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    original_content = content
    total_duplicates_removed = 0
    
    # Fix duplications for each CSS file
    css_files_to_check = [
        'custom-redesign.css',
        'header-system.css',
        'compact-layout.css',
        'advanced-effects.css',
        'mobile-optimizations.css'
    ]
    
    for css_file in css_files_to_check:
        content, duplicates_removed = remove_duplicate_css_lines(content, css_file)
        if duplicates_removed > 0:
            print(f"  ✅ Removed {duplicates_removed} duplicate(s) of {css_file}")
            total_duplicates_removed += duplicates_removed
    
    if total_duplicates_removed > 0:
        # Write the fixed content
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  📊 Total duplicates removed: {total_duplicates_removed}")
        return True
    else:
        print(f"  ✅ No duplicates found")
        # Remove the backup since no changes were made
        os.remove(backup_filename)
        return True

def main():
    """Main processing function"""
    print("=== CSS DUPLICATION FIX ===")
    print(f"Started at: {datetime.now()}")
    print()
    
    processed = 0
    
    for filename in FILES_TO_FIX:
        if fix_file_duplications(filename):
            processed += 1
        print()
    
    print("=== SUMMARY ===")
    print(f"Files processed: {processed}")
    print(f"Total files: {len(FILES_TO_FIX)}")
    print()
    
    print("=== CSS DUPLICATION FIX COMPLETE ===")

if __name__ == "__main__":
    main()

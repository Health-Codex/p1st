#!/usr/bin/env python3

"""
Batch Header Structure Fix Script
Applies mobile menu header structure to multiple HTML files
"""

import os
import re
from datetime import datetime

# List of files to process (excluding already completed ones)
FILES_TO_PROCESS = [
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

# Mobile menu header template
MOBILE_MENU_HEADER = '''                <!-- Mobile Menu Header -->
                <div class="mobile-menu-header">
                    <div class="mobile-menu-logo">
                        <img src="assets/images/logo_peoplefirst-01.svg"
                             alt="People First Urgent Care"
                             width="auto"
                             height="40">
                    </div>
                    <button class="mobile-menu-close" aria-label="Close navigation menu">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>

                <!-- Navigation Menu -->'''

def process_file(filename):
    """Process a single HTML file to add mobile menu header structure"""
    
    if not os.path.exists(filename):
        print(f"❌ {filename} - FILE NOT FOUND")
        return False
    
    # Check if already processed
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'mobile-menu-header' in content:
        print(f"✅ {filename} - mobile-menu-header already present, skipping")
        return True
    
    print(f"🔧 Processing: {filename}")
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_filename = f"{filename}.bak.header-{timestamp}"
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Pattern to match: nav tag followed by ul.menu
    pattern = r'(\s*<nav class="main-navigation"[^>]*>\s*)\n(\s*<ul class="menu">)'
    
    # Replacement: nav tag + mobile menu header + ul.menu
    replacement = r'\1\n' + MOBILE_MENU_HEADER + r'\n\2'
    
    # Apply the replacement
    new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    
    if new_content != content:
        # Write the updated content
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  ✅ Added mobile-menu-header structure")
        return True
    else:
        print(f"  ❌ Could not find pattern to replace in {filename}")
        return False

def main():
    """Main processing function"""
    print("=== BATCH HEADER STRUCTURE FIX ===")
    print(f"Started at: {datetime.now()}")
    print()
    
    processed = 0
    skipped = 0
    
    for filename in FILES_TO_PROCESS:
        if process_file(filename):
            processed += 1
        else:
            skipped += 1
        print()
    
    print("=== SUMMARY ===")
    print(f"Files processed: {processed}")
    print(f"Files skipped: {skipped}")
    print(f"Total files: {len(FILES_TO_PROCESS)}")
    print()
    
    # Verification
    print("=== VERIFICATION ===")
    for filename in FILES_TO_PROCESS:
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'mobile-menu-header' in content:
                print(f"✅ {filename} - mobile-menu-header present")
            else:
                print(f"❌ {filename} - mobile-menu-header missing")
    
    print()
    print("=== BATCH PROCESSING COMPLETE ===")

if __name__ == "__main__":
    main()

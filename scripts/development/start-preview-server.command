#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

# Print a message to the user
echo "Starting local web server for People First Urgent Care website preview..."
echo "Website will be available at: http://localhost:8000"
echo ""
echo "To view the website, open your browser and go to: http://localhost:8000"
echo "To view the contact page, go to: http://localhost:8000/contact/"
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Open the website in the default browser
open http://localhost:8000

# Start a simple HTTP server on port 8000
# Try different Python commands to ensure compatibility
if command -v python3 &>/dev/null; then
    python3 -m http.server 8000
elif command -v python &>/dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "Error: Python is not installed or not in your PATH."
    echo "Please install Python and try again."
    # Keep the terminal window open so the user can see the error
    read -p "Press Enter to close this window..."
    exit 1
fi

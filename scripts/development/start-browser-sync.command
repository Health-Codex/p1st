#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

# Print a message to the user
echo "Starting Browser-Sync for People First Urgent Care website..."
echo "Website will be available at: http://localhost:3000"
echo ""
echo "Browser-Sync UI will be available at: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Use the locally installed browser-sync from node_modules
echo "Starting Browser-Sync using local installation..."
npx browser-sync start --config bs-config.js

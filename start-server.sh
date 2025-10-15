#!/bin/bash

# Start local web server for People First Urgent Care website
echo "Starting local web server..."
echo "Access your site at: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server
python3 -m http.server 8000

#!/bin/bash
# ============================================
# Static Assets Migration Script
# Copies required assets from old Gatsby project
# ============================================
#
# Run this script from the next-farm-mgt directory:
#   chmod +x scripts/migrate-assets.sh
#   ./scripts/migrate-assets.sh
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NEXT_DIR="$(dirname "$SCRIPT_DIR")"
GATSBY_DIR="$(dirname "$NEXT_DIR")/frontend"

echo "======================================"
echo "  Static Assets Migration Script"
echo "======================================"
echo ""
echo "Source (Gatsby): $GATSBY_DIR"
echo "Target (Next.js): $NEXT_DIR"
echo ""

# Check if Gatsby directory exists
if [ ! -d "$GATSBY_DIR" ]; then
    echo "ERROR: Gatsby frontend directory not found at $GATSBY_DIR"
    exit 1
fi

# Create target directories
mkdir -p "$NEXT_DIR/public/icons"
mkdir -p "$NEXT_DIR/public/images/deficiencies"

# Copy icons
echo "Copying icons..."
if [ -d "$GATSBY_DIR/public/icons" ]; then
    cp -v "$GATSBY_DIR/public/icons/"*.png "$NEXT_DIR/public/icons/" 2>/dev/null || echo "No icons found in public/icons"
fi

# Copy deficiency images
echo "Copying deficiency images..."
if [ -d "$GATSBY_DIR/static/images/deficiencies" ]; then
    cp -v "$GATSBY_DIR/static/images/deficiencies/"* "$NEXT_DIR/public/images/deficiencies/" 2>/dev/null || echo "No deficiency images found"
elif [ -d "$GATSBY_DIR/public/images/deficiencies" ]; then
    cp -v "$GATSBY_DIR/public/images/deficiencies/"* "$NEXT_DIR/public/images/deficiencies/" 2>/dev/null || echo "No deficiency images found"
fi

# Copy favicon
echo "Copying favicon..."
if [ -f "$GATSBY_DIR/public/favicon-32x32.png" ]; then
    cp -v "$GATSBY_DIR/public/favicon-32x32.png" "$NEXT_DIR/public/favicon.ico"
fi

echo ""
echo "======================================"
echo "  Migration Complete!"
echo "======================================"
echo ""
echo "Please verify the following files exist:"
echo "  - public/icons/icon-*.png (8 files)"
echo "  - public/images/deficiencies/*.jpg"
echo "  - public/favicon.ico"
echo ""
echo "If any files are missing, manually copy them from:"
echo "  $GATSBY_DIR/static/"
echo "  $GATSBY_DIR/public/"
echo ""

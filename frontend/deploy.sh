#!/bin/bash
# ============================================
# Farm Management System - Next.js Frontend
# Deployment Script for VPS with PM2
# ============================================
# 
# Usage:
#   ./deploy.sh              - Full deployment (pull, install, build, restart)
#   ./deploy.sh --quick      - Quick restart (no rebuild)
#   ./deploy.sh --build-only - Build without restart
#   ./deploy.sh --setup      - First-time setup
#
# Prerequisites:
#   - Node.js 18+ installed
#   - PM2 installed globally (npm install -g pm2)
#   - Git access to repository
#   - .env.production.local configured
# ============================================

set -e  # Exit on any error

# Configuration
APP_NAME="farm-mgt-nextjs"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$APP_DIR/logs/deploy.log"
BRANCH="${DEPLOY_BRANCH:-main}"
NODE_ENV="${NODE_ENV:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp]${NC} $1"
    echo "[$timestamp] $1" >> "$LOG_FILE" 2>/dev/null || true
}

error() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] ERROR:${NC} $1"
    echo "[$timestamp] ERROR: $1" >> "$LOG_FILE" 2>/dev/null || true
}

success() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $1"
    echo "[$timestamp] SUCCESS: $1" >> "$LOG_FILE" 2>/dev/null || true
}

warn() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] WARNING:${NC} $1"
    echo "[$timestamp] WARNING: $1" >> "$LOG_FILE" 2>/dev/null || true
}

# Ensure logs directory exists
mkdir -p "$APP_DIR/logs"

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
        exit 1
    fi
    NODE_VERSION=$(node -v)
    log "Node.js version: $NODE_VERSION"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
        exit 1
    fi
    
    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        error "PM2 is not installed. Run: npm install -g pm2"
        exit 1
    fi
    
    # Check .env file
    if [[ ! -f "$APP_DIR/.env.production.local" ]] && [[ ! -f "$APP_DIR/.env.local" ]]; then
        warn "No .env.production.local or .env.local found. Using defaults."
    fi
    
    success "All prerequisites met"
}

# Pull latest code from git
pull_code() {
    log "Pulling latest code from $BRANCH..."
    cd "$APP_DIR"
    
    # Stash any local changes
    git stash --quiet || true
    
    # Fetch and pull
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    
    success "Code updated to latest $BRANCH"
}

# Install dependencies
install_deps() {
    log "Installing dependencies..."
    cd "$APP_DIR"
    
    # Use npm ci for clean install in production
    if [[ "$NODE_ENV" == "production" ]]; then
        npm ci --production=false
    else
        npm install
    fi
    
    success "Dependencies installed"
}

# Build the application
build_app() {
    log "Building Next.js application..."
    cd "$APP_DIR"
    
    # Clear Next.js cache
    rm -rf .next/cache
    
    # Build
    npm run build
    
    success "Build completed"
}

# Restart PM2 process
restart_pm2() {
    log "Restarting PM2 process..."
    cd "$APP_DIR"
    
    # Check if app is already running
    if pm2 describe "$APP_NAME" &> /dev/null; then
        log "Reloading existing PM2 process (zero-downtime)..."
        pm2 reload ecosystem.config.js --env "$NODE_ENV"
    else
        log "Starting new PM2 process..."
        pm2 start ecosystem.config.js --env "$NODE_ENV"
    fi
    
    # Save PM2 process list
    pm2 save
    
    success "PM2 process restarted"
}

# Health check
health_check() {
    log "Running health check..."
    
    # Wait for app to start
    sleep 5
    
    # Get port from environment or default
    PORT="${PORT:-3000}"
    
    # Check if app responds
    for i in {1..5}; do
        if curl -sf "http://localhost:$PORT/api/health" > /dev/null 2>&1; then
            success "Health check passed! App is running on port $PORT"
            return 0
        fi
        log "Waiting for app to start... (attempt $i/5)"
        sleep 3
    done
    
    error "Health check failed! Check logs with: pm2 logs $APP_NAME"
    return 1
}

# Show status
show_status() {
    echo ""
    echo "======================================"
    echo "        DEPLOYMENT STATUS"
    echo "======================================"
    pm2 describe "$APP_NAME" | head -30
    echo ""
    echo "View logs: pm2 logs $APP_NAME"
    echo "Monitor:   pm2 monit"
    echo "======================================"
}

# First-time setup
first_time_setup() {
    log "Running first-time setup..."
    
    check_prerequisites
    
    # Create necessary directories
    mkdir -p "$APP_DIR/logs"
    
    # Copy environment file if template exists
    if [[ -f "$APP_DIR/.env.production.example" ]] && [[ ! -f "$APP_DIR/.env.production.local" ]]; then
        cp "$APP_DIR/.env.production.example" "$APP_DIR/.env.production.local"
        warn "Created .env.production.local from template. Please edit it with your values!"
    fi
    
    install_deps
    build_app
    
    # Setup PM2 startup script
    pm2 startup || warn "Run the command above with sudo to enable PM2 startup"
    
    restart_pm2
    health_check
    show_status
    
    success "First-time setup completed!"
}

# Quick restart without rebuild
quick_restart() {
    log "Performing quick restart..."
    restart_pm2
    health_check
    show_status
    success "Quick restart completed!"
}

# Build only (no restart)
build_only() {
    log "Building without restart..."
    check_prerequisites
    install_deps
    build_app
    success "Build completed! Use './deploy.sh --quick' to restart."
}

# Full deployment
full_deploy() {
    log "Starting full deployment..."
    echo ""
    echo "======================================"
    echo "   Farm Management System Deployment"
    echo "======================================"
    echo ""
    
    check_prerequisites
    pull_code
    install_deps
    build_app
    restart_pm2
    health_check
    show_status
    
    success "Deployment completed successfully!"
}

# Main script
case "${1:-}" in
    --setup)
        first_time_setup
        ;;
    --quick)
        quick_restart
        ;;
    --build-only)
        build_only
        ;;
    --help|-h)
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  (no option)   Full deployment (pull, install, build, restart)"
        echo "  --quick       Quick restart without rebuild"
        echo "  --build-only  Build without restart"
        echo "  --setup       First-time setup"
        echo "  --help        Show this help"
        ;;
    *)
        full_deploy
        ;;
esac

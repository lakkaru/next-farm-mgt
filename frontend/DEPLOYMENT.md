# Deployment Guide - Farm Management System (Next.js)

This guide covers deploying the Next.js farm management frontend on a VPS using PM2.

## Prerequisites

1. **Node.js** (v18.17 or later)
2. **npm** or **yarn**
3. **PM2** process manager
4. **Nginx** (recommended as reverse proxy)
5. **Git** for deployment

## Installation

### 1. Install Node.js (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install PM2 Globally

```bash
sudo npm install -g pm2
```

### 3. Clone and Build

```bash
# Clone your repository
git clone https://github.com/your-username/farm-mgt.git
cd farm-mgt/next-farm-mgt

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your production values
nano .env.local

# Build for production
npm run build
```

## PM2 Commands

### Start Application

```bash
# Start with ecosystem config
pm2 start ecosystem.config.js --env production

# Or start directly
pm2 start npm --name "farm-mgt" -- start
```

### Manage Application

```bash
# View status
pm2 status

# View logs
pm2 logs farm-mgt-frontend

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart farm-mgt-frontend

# Reload with zero downtime
pm2 reload farm-mgt-frontend

# Stop application
pm2 stop farm-mgt-frontend

# Delete from PM2
pm2 delete farm-mgt-frontend
```

### Save and Startup

```bash
# Save current process list
pm2 save

# Generate startup script (run as root or with sudo)
pm2 startup

# Follow the instructions printed by the above command
```

## Nginx Configuration

Create `/etc/nginx/sites-available/farm-mgt`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Logs
    access_log /var/log/nginx/farm-mgt.access.log;
    error_log /var/log/nginx/farm-mgt.error.log;

    # Next.js static files (cached)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Cache static files for 1 year
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files in public folder
    location /static {
        alias /var/www/farm-mgt/next-farm-mgt/public;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API proxy (if backend is separate)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/farm-mgt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

## Environment Variables

Update `.env.local` for production:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_NAME="Farm Management System"
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# If using external services
# Add any other environment-specific variables
```

## Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production=false

# Build application
npm run build

# Reload PM2 with zero downtime
pm2 reload ecosystem.config.js --env production

echo "✅ Deployment complete!"
```

Make it executable:

```bash
chmod +x deploy.sh
```

## Monitoring

### PM2 Metrics

```bash
# Real-time monitoring
pm2 monit

# Dashboard
pm2 plus  # Requires PM2 Plus subscription for advanced features
```

### Health Check Endpoint

The application includes a health check at `/api/health` (if implemented in Next.js API routes).

```bash
curl https://yourdomain.com/api/health
```

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs farm-mgt-frontend --lines 100

# Check if port is in use
sudo netstat -tlnp | grep 3000
```

### Memory Issues

```bash
# Increase memory limit in ecosystem.config.js
max_memory_restart: '2G'

# Or monitor memory usage
pm2 monit
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/farm-mgt.error.log
```

## Backup

### Database Backup (MongoDB)

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/farm_mgt" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017/farm_mgt" /backup/20240101
```

### Application Backup

```bash
# Backup uploads and important files
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/ .env.local
```

## Security Checklist

- [ ] SSL/TLS enabled
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] PM2 running as non-root user
- [ ] Environment variables secured
- [ ] Database authentication enabled
- [ ] Rate limiting configured
- [ ] Backup strategy in place

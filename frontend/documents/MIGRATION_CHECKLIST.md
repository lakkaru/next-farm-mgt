# Standalone Migration Checklist

## ✅ Completed: Files Created/Updated

### Environment Configuration
| File | Purpose | Status |
|------|---------|--------|
| `.env.example` | Development environment template | ✅ Updated |
| `.env.production.example` | Production environment template | ✅ Created |

### Backend/API Integration (Next.js Route Handlers)
| File | Purpose | Status |
|------|---------|--------|
| `src/app/api/health/route.ts` | Health check endpoint for monitoring | ✅ Created |
| `src/app/api/auth/login/route.ts` | Server-side login with HTTP-only cookies | ✅ Created |
| `src/app/api/auth/logout/route.ts` | Clear auth cookies | ✅ Created |
| `src/app/api/auth/session/route.ts` | Session validation | ✅ Created |
| `src/app/api/proxy/[...path]/route.ts` | Generic API proxy for backend | ✅ Created |

### Process Management
| File | Purpose | Status |
|------|---------|--------|
| `ecosystem.config.js` | PM2 configuration with cluster mode | ✅ Updated |
| `nginx.conf` | Nginx reverse proxy configuration | ✅ Created |

### Deployment Scripts
| File | Purpose | Status |
|------|---------|--------|
| `deploy.sh` | Automated deployment script | ✅ Created |
| `scripts/migrate-assets.sh` | Static assets migration helper | ✅ Created |

### CI/CD & Git
| File | Purpose | Status |
|------|---------|--------|
| `.gitignore` | Next.js optimized gitignore | ✅ Updated |
| `.github/workflows/deploy.yml` | Main CI/CD pipeline | ✅ Created |
| `.github/workflows/pr-checks.yml` | PR quality checks | ✅ Created |
| `.github/dependabot.yml` | Automated dependency updates | ✅ Created |

### Static Assets
| File | Purpose | Status |
|------|---------|--------|
| `public/manifest.json` | PWA manifest | ✅ Created |
| `public/browserconfig.xml` | Windows tile config | ✅ Created |
| `public/robots.txt` | SEO robots file | ✅ Created |
| `public/icons/` | Directory for app icons | ✅ Created |
| `public/images/deficiencies/` | Directory for deficiency images | ✅ Created |

---

## 📋 Manual Steps Required

### 1. Copy Static Assets
Run the migration script or manually copy:

```bash
# From next-farm-mgt directory
chmod +x scripts/migrate-assets.sh
./scripts/migrate-assets.sh
```

Or manually copy these files from `frontend/`:
- `public/icons/*.png` → `next-farm-mgt/public/icons/`
- `static/images/deficiencies/*.jpg` → `next-farm-mgt/public/images/deficiencies/`
- `public/favicon-32x32.png` → `next-farm-mgt/public/favicon.ico`

### 2. Configure Environment Variables
Create `.env.local` for development:
```bash
cp .env.example .env.local
# Edit with your values
```

Create `.env.production.local` for VPS:
```bash
cp .env.production.example .env.production.local
# Edit with production values
```

### 3. GitHub Repository Setup

1. Create new GitHub repository
2. Add secrets in Settings → Secrets and variables → Actions:
   - `VPS_HOST` - Your VPS IP address
   - `VPS_USER` - SSH user (e.g., `deploy`)
   - `VPS_SSH_KEY` - Private SSH key for deployment
   - `VPS_PORT` - SSH port (default: 22)
   - `PRODUCTION_URL` - Production URL for health checks
   - `NEXT_PUBLIC_API_URL` - Backend API URL

### 4. VPS First-Time Setup

```bash
# Clone repository
git clone git@github.com:your-username/next-farm-mgt.git /var/www/farm-mgt-frontend
cd /var/www/farm-mgt-frontend

# Run first-time setup
chmod +x deploy.sh
./deploy.sh --setup

# Setup Nginx
sudo cp nginx.conf /etc/nginx/sites-available/farm-frontend
sudo ln -s /etc/nginx/sites-available/farm-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d farm.yourdomain.com
```

---

## 🔍 Files Still in Parent Backend

The following backend files remain in `backend/` and are **NOT part of the frontend**:

| Backend File | Purpose | Action |
|--------------|---------|--------|
| `.env` | Backend environment | Keep in backend repo |
| `.env.r2.example` | R2 storage config | Keep in backend repo |
| `server.js` | Express.js entry | Keep in backend repo |
| `src/controllers/` | API controllers | Keep in backend repo |
| `src/models/` | MongoDB models | Keep in backend repo |
| `src/routes/` | API routes | Keep in backend repo |
| `src/middleware/` | Auth middleware | Keep in backend repo |
| `src/services/` | Business logic | Keep in backend repo |

The frontend communicates with the backend via:
- `NEXT_PUBLIC_API_URL` environment variable
- `src/lib/api.ts` axios client

---

## 📁 Final Project Structure

```
next-farm-mgt/
├── .env.example                    # Dev environment template
├── .env.production.example         # Prod environment template
├── .gitignore                      # Git ignore rules
├── deploy.sh                       # Deployment script
├── ecosystem.config.js             # PM2 configuration
├── nginx.conf                      # Nginx configuration
├── package.json                    # Dependencies + scripts
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind CSS config
├── next.config.mjs                 # Next.js config
├── README.md                       # Project documentation
├── DEPLOYMENT.md                   # Deployment guide
├── MIGRATION_CHECKLIST.md          # This file
│
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml              # CI/CD pipeline
│   │   └── pr-checks.yml           # PR quality checks
│   └── dependabot.yml              # Dependency updates
│
├── public/
│   ├── icons/                      # PWA icons (copy from Gatsby)
│   ├── images/
│   │   └── deficiencies/           # Disease images (copy from Gatsby)
│   ├── manifest.json               # PWA manifest
│   ├── browserconfig.xml           # Windows tiles
│   ├── robots.txt                  # SEO
│   └── favicon.ico                 # (copy from Gatsby)
│
├── scripts/
│   ├── copy-translations.js        # i18n file copier
│   └── migrate-assets.sh           # Asset migration
│
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── health/route.ts     # Health endpoint
    │   │   ├── auth/
    │   │   │   ├── login/route.ts
    │   │   │   ├── logout/route.ts
    │   │   │   └── session/route.ts
    │   │   └── proxy/[...path]/route.ts
    │   ├── (dashboard)/            # Protected routes
    │   ├── login/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── ui/                     # shadcn/ui components
    │   ├── layout/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── farms/
    │   ├── paddy/
    │   ├── machinery/
    │   ├── admin/
    │   └── profile/
    ├── contexts/
    │   ├── auth-context.tsx
    │   └── i18n-context.tsx
    ├── hooks/
    ├── i18n/
    │   ├── index.ts
    │   └── locales/
    │       ├── en.json
    │       └── si.json
    └── lib/
        ├── api.ts
        └── utils.ts
```

---

## 🚀 Quick Start Commands

```bash
# Development
npm install
npm run dev

# Production build
npm run build
npm start

# PM2 deployment
pm2 start ecosystem.config.js --env production

# Full deployment
./deploy.sh
```

---

## ⚠️ Important Notes

1. **Backend is separate**: This frontend expects the Express.js backend to run independently
2. **Environment variables**: Never commit actual `.env` files with secrets
3. **CORS**: Backend must allow requests from your frontend domain
4. **SSL**: Use Let's Encrypt for free SSL certificates
5. **PM2**: Install globally with `npm install -g pm2`

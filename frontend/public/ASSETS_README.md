# Missing Static Assets

## Icons Required

The following PWA icon files need to be copied from the old Gatsby project:

### Source Locations (Gatsby project):
- `frontend/public/icons/icon-*.png`

### Target Location (Next.js project):
Copy all icon files to: `public/icons/`

### Required Files:
- icon-48x48.png
- icon-72x72.png
- icon-96x96.png
- icon-144x144.png
- icon-192x192.png
- icon-256x256.png
- icon-384x384.png
- icon-512x512.png

## Quick Copy Command

From the `next-farm-mgt` directory, run:

```bash
# Windows PowerShell
Copy-Item ..\frontend\public\icons\*.png .\public\icons\

# Linux/Mac/Git Bash
cp ../frontend/public/icons/*.png ./public/icons/

# Or use the provided script
chmod +x scripts/migrate-assets.sh
./scripts/migrate-assets.sh
```

## Other Assets

### Deficiency Images
Copy from: `frontend/static/images/deficiencies/` or `frontend/public/images/deficiencies/`
To: `public/images/deficiencies/`

Required files:
- iron-toxicity.jpg
- nitrogen.jpg
- phosphorus.jpg
- potassium.jpg
- sulfur.jpg
- zinc.jpg

### Favicon
Copy from: `frontend/public/favicon-32x32.png`
To: `public/favicon.ico`

## Verification

After copying, verify all files exist:

```bash
ls -la public/icons/
ls -la public/images/deficiencies/
ls -la public/favicon.ico
```

Then restart the dev server:
```bash
npm run dev
```

# Farm Management System - Next.js Frontend

A modern farm management system built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5.4
- **Styling:** Tailwind CSS 3.4 with tailwindcss-animate
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** 
  - Zustand for global state
  - @tanstack/react-query 5 for server state
- **Forms:** Formik with Yup validation
- **HTTP Client:** Axios
- **Internationalization:** i18next with react-i18next (Sinhala/English)
- **Notifications:** Sonner

## Features

- 🏠 **Dashboard** - Overview of farm statistics, quick actions
- 🌾 **Farm Management** - Create, edit, delete farms
- 🌱 **Paddy Cultivation**
  - Season Plans - Plan and track cultivation seasons
  - Paddy Varieties - Browse available rice varieties
  - Disease Detection - AI-powered plant disease detection
- 🚜 **Machinery Services**
  - Search for machinery services
  - List your own machinery
  - Manage service requests
- 👥 **Admin Panel**
  - User Management
  - Disease References
- 🌐 **Internationalization** - Full Sinhala and English support
- 📱 **Responsive Design** - Works on all device sizes

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd next-farm-mgt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_NAME="Farm Management System"
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
next-farm-mgt/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Authenticated routes (grouped)
│   │   │   ├── dashboard/
│   │   │   ├── farms/
│   │   │   ├── paddy/
│   │   │   ├── machinery/
│   │   │   ├── admin/
│   │   │   ├── profile/
│   │   │   └── layout.tsx      # Dashboard layout with sidebar
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components (AppShell, etc.)
│   │   ├── auth/               # Authentication components
│   │   ├── farms/              # Farm-related components
│   │   ├── paddy/              # Paddy cultivation components
│   │   ├── machinery/          # Machinery service components
│   │   ├── admin/              # Admin panel components
│   │   └── profile/            # Profile components
│   ├── contexts/               # React contexts
│   │   └── auth-context.tsx    # Authentication context
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization
│   │   ├── locales/            # Translation files
│   │   │   ├── en.json
│   │   │   └── si.json
│   │   └── index.ts            # i18n configuration
│   ├── lib/
│   │   ├── api.ts              # API client with axios
│   │   └── utils.ts            # Utility functions
│   └── styles/
│       └── globals.css         # Global styles with Tailwind
├── public/                     # Static assets
├── scripts/                    # Utility scripts
├── ecosystem.config.js         # PM2 configuration
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions using PM2 and Nginx.

### Quick Start with PM2

```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

## Migration from Gatsby

This project was migrated from a Gatsby frontend. Key changes include:

1. **Routing:** Gatsby's file-based routing → Next.js App Router
2. **Data Fetching:** React Query v3 → @tanstack/react-query v5
3. **Styling:** MUI/Emotion → Tailwind CSS + shadcn/ui
4. **Navigation:** Gatsby navigate() → Next.js useRouter()
5. **Static Generation:** Gatsby's build-time generation → Next.js SSR/SSG/ISR

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

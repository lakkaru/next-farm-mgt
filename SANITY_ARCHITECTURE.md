# Sanity.io Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SANITY.IO INTEGRATION                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  Agricultural Expert │
│   (Content Manager)  │
└──────────┬───────────┘
           │
           │ Creates/Edits Content
           ↓
┌──────────────────────────────────────────────────────────────────┐
│                      SANITY STUDIO (CMS)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Disease Categories                                         │  │
│  │  • Nutrition Deficiencies                                   │  │
│  │  • Insect Damage                                            │  │
│  │  • Fungal Diseases                                          │  │
│  │  • Bacterial Diseases                                       │  │
│  │  • Viral Diseases                                           │  │
│  │  • Environmental Stress                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Disease Information                                        │  │
│  │  • Name & Scientific Name                                   │  │
│  │  • Category Reference                                       │  │
│  │  • Severity Level                                           │  │
│  │  • Images (Main + Additional)                               │  │
│  │  • Symptoms, Causes, Treatment                              │  │
│  │  • Prevention, Expert Notes                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Location: http://localhost:3333 or your-studio.sanity.studio    │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ Publishes to
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    SANITY CLOUD (Database)                        │
│  • Content Storage                                                │
│  • Image CDN                                                      │
│  • Version History                                                │
│  • Real-time Sync                                                 │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ API Requests
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Sanity Client (/src/sanity/lib/client.ts)                 │  │
│  │  • Fetches data via GROQ queries                            │  │
│  │  • Handles image URLs                                       │  │
│  │  • Type-safe interfaces                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Disease Detection Component                                │  │
│  │  (/src/components/paddy/disease-detection-sanity.tsx)       │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Category Tabs                                        │  │  │
│  │  │  [All] [Nutrition] [Insect] [Fungal] [Bacterial]...  │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Disease Cards Grid                                   │  │  │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐                    │  │  │
│  │  │  │Disease │ │Disease │ │Disease │                    │  │  │
│  │  │  │  Card  │ │  Card  │ │  Card  │                    │  │  │
│  │  │  │  [IMG] │ │  [IMG] │ │  [IMG] │                    │  │  │
│  │  │  │ Name   │ │ Name   │ │ Name   │                    │  │  │
│  │  │  │Symptoms│ │Symptoms│ │Symptoms│                    │  │  │
│  │  │  └────────┘ └────────┘ └────────┘                    │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Detail Modal (on click)                             │  │  │
│  │  │  • Full disease information                          │  │  │
│  │  │  • High-res images                                   │  │  │
│  │  │  • Complete treatment guide                          │  │  │
│  │  │  • Prevention measures                               │  │  │
│  │  │  • Expert notes                                      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ Displays to
                            ↓
┌──────────────────────┐
│   Farmer (End User)  │
│  • Browse diseases   │
│  • View treatments   │
│  • Access guides     │
└──────────────────────┘
```

## Data Flow

```
┌─────────────────┐
│ Content Manager │
└────────┬────────┘
         │
         │ 1. Creates/Edits Disease Info
         ↓
┌─────────────────┐
│  Sanity Studio  │
└────────┬────────┘
         │
         │ 2. Publishes Content
         ↓
┌─────────────────┐
│  Sanity Cloud   │
└────────┬────────┘
         │
         │ 3. API Request (GROQ Query)
         ↓
┌─────────────────┐
│ Sanity Client   │
│  (Frontend)     │
└────────┬────────┘
         │
         │ 4. Returns Typed Data
         ↓
┌─────────────────┐
│ React Component │
└────────┬────────┘
         │
         │ 5. Renders UI
         ↓
┌─────────────────┐
│   End User      │
└─────────────────┘
```

## File Structure

```
next-farm-mgt/
│
├── sanity/                              # Sanity Studio (CMS)
│   ├── schemas/
│   │   ├── diseaseCategory.ts           # Category schema
│   │   ├── diseaseInfo.ts               # Disease schema
│   │   └── index.ts                     # Schema exports
│   │
│   ├── lib/
│   │   ├── client.ts                    # Sanity client config
│   │   ├── image.ts                     # Image URL builder
│   │   └── queries.ts                   # GROQ queries
│   │
│   ├── sanity.config.ts                 # Main config
│   ├── package.json                     # Dependencies
│   └── README.md                        # Documentation
│
├── frontend/
│   ├── src/
│   │   ├── sanity/                      # Sanity integration
│   │   │   ├── lib/
│   │   │   │   ├── client.ts            # Client instance
│   │   │   │   ├── image.ts             # Image helpers
│   │   │   │   └── queries.ts           # Data queries
│   │   │   └── env.ts                   # Environment config
│   │   │
│   │   └── components/
│   │       └── paddy/
│   │           ├── disease-detection-content.tsx      # Old (hardcoded)
│   │           └── disease-detection-sanity.tsx       # New (Sanity)
│   │
│   ├── .env.local.example               # Env template
│   └── package.json                     # Dependencies
│
├── scripts/
│   ├── setup-sanity.sh                  # Setup script (Linux/Mac)
│   ├── setup-sanity.bat                 # Setup script (Windows)
│   └── migrate-to-sanity.js             # Migration helper
│
├── SANITY_INTEGRATION.md                # Quick start guide
├── SANITY_SETUP.md                      # Detailed setup
└── SANITY_SUMMARY.md                    # Implementation summary
```

## Component Hierarchy

```
DiseaseDetectionContent (disease-detection-sanity.tsx)
│
├── useState (selectedDisease, diseases, categories, loading)
│
├── useEffect (fetchData on mount)
│   └── Promise.all([getAllDiseases(), getDiseaseCategories()])
│
├── Header
│   ├── Title
│   └── Subtitle
│
├── Alert (Info about AI detection)
│
├── Tabs (Category filtering)
│   ├── TabsList
│   │   ├── TabsTrigger (All)
│   │   └── TabsTrigger (for each category)
│   │
│   └── TabsContent
│       └── Disease Cards Grid
│           └── Card (for each disease)
│               ├── Image
│               ├── Badge (Severity)
│               ├── CardHeader (Name, Category)
│               ├── CardContent
│               │   ├── Symptoms preview
│               │   ├── Critical stages
│               │   └── Button (View details)
│               │
│               └── onClick → setSelectedDisease
│
└── Dialog (Detail Modal)
    └── DialogContent
        ├── DialogHeader (Name, Severity, Category)
        ├── Main Image
        ├── Description
        ├── Visual Signs
        ├── All Symptoms
        ├── Common Causes
        ├── Treatment Protocol
        ├── Prevention Measures
        ├── Critical Stages Alert
        └── Additional Info (Economic Impact, Seasonality, Expert Notes)
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│           TECHNOLOGY STACK              │
├─────────────────────────────────────────┤
│                                         │
│  CMS:                                   │
│  • Sanity.io v3                         │
│  • Sanity Studio                        │
│                                         │
│  Frontend:                              │
│  • Next.js 14                           │
│  • React 18                             │
│  • TypeScript                           │
│  • next-sanity                          │
│  • @sanity/image-url                    │
│                                         │
│  UI Components:                         │
│  • shadcn/ui                            │
│  • Radix UI                             │
│  • Tailwind CSS                         │
│  • Lucide Icons                         │
│                                         │
│  Data Fetching:                         │
│  • GROQ (Sanity Query Language)         │
│  • React Hooks (useState, useEffect)    │
│                                         │
│  Image Handling:                        │
│  • Next.js Image Component              │
│  • Sanity Image CDN                     │
│  • Image URL Builder                    │
│                                         │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                       │
└──────────────────────────────────────────────────────────┘

┌─────────────────────┐
│  Sanity Studio      │
│  (Hosted on Sanity) │
│  your-studio.       │
│  sanity.studio      │
└──────────┬──────────┘
           │
           │ Manages Content
           ↓
┌─────────────────────┐
│   Sanity Cloud      │
│   (Content Lake)    │
│   • Database        │
│   • Image CDN       │
│   • API Endpoint    │
└──────────┬──────────┘
           │
           │ API Calls
           ↓
┌─────────────────────┐
│  Next.js Frontend   │
│  (Vercel/Netlify)   │
│  your-app.vercel.   │
│  app                │
└──────────┬──────────┘
           │
           │ Serves to
           ↓
┌─────────────────────┐
│    End Users        │
│  (Farmers)          │
└─────────────────────┘
```

---

This architecture provides:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Easy content management
- ✅ Type safety
- ✅ Performance optimization
- ✅ Developer-friendly workflow

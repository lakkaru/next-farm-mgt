# Disease Detection - Sanity.io Integration

## 🎯 Overview

The disease detection page has been upgraded to use **Sanity.io** as a headless CMS. This allows agricultural experts to manage disease information without touching code.

## ✨ Key Features

### For Content Managers (Agricultural Experts)
- ✅ Add/edit disease information through a user-friendly interface
- ✅ Upload and manage reference images
- ✅ Organize diseases into categories
- ✅ Update treatment protocols in real-time
- ✅ No coding knowledge required

### For End Users (Farmers)
- ✅ Browse diseases by category (Nutrition Deficiencies, Insect Damage, etc.)
- ✅ View high-quality reference images
- ✅ Access comprehensive treatment guides
- ✅ Mobile-responsive design
- ✅ Multi-language support

## 📁 Project Structure

```
next-farm-mgt/
├── sanity/                          # Sanity Studio (CMS)
│   ├── schemas/
│   │   ├── diseaseCategory.ts       # Category schema
│   │   ├── diseaseInfo.ts           # Disease information schema
│   │   └── index.ts
│   ├── lib/
│   │   ├── client.ts                # Sanity client
│   │   ├── image.ts                 # Image URL builder
│   │   └── queries.ts               # Data queries
│   ├── sanity.config.ts             # Studio configuration
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── sanity/                  # Sanity integration
│   │   │   ├── lib/
│   │   │   │   ├── client.ts
│   │   │   │   ├── image.ts
│   │   │   │   └── queries.ts
│   │   │   └── env.ts
│   │   └── components/
│   │       └── paddy/
│   │           ├── disease-detection-content.tsx      # Old component (hardcoded data)
│   │           └── disease-detection-sanity.tsx       # New component (Sanity data)
│   └── .env.local.example
│
├── scripts/
│   └── migrate-to-sanity.js         # Migration helper
│
└── SANITY_SETUP.md                  # Detailed setup guide
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Sanity dependencies
cd sanity
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Sanity Project

```bash
cd sanity
npm create sanity@latest
```

Follow the prompts to create a new project and note your **Project ID**.

### 3. Configure Environment Variables

```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-03
```

### 4. Run Sanity Studio

```bash
cd sanity
npm run dev
```

Studio will be available at http://localhost:3333

### 5. Add Initial Content

1. Open Sanity Studio
2. Create **Disease Categories**:
   - Nutrition Deficiencies
   - Insect Damage
   - Fungal Diseases
   - Bacterial Diseases
   - Viral Diseases
   - Environmental Stress

3. Add **Disease Information** entries with:
   - Name and scientific name
   - Category
   - Severity level
   - Images
   - Symptoms, treatment, prevention
   - Expert notes

### 6. Update Frontend Component

In your disease detection page, update the import:

```typescript
// Change from:
import { DiseaseDetectionContent } from '@/components/paddy/disease-detection-content'

// To:
import { DiseaseDetectionContent } from '@/components/paddy/disease-detection-sanity'
```

### 7. Run Frontend

```bash
cd frontend
npm run dev
```

Visit the disease detection page to see Sanity data!

## 📊 Data Schema

### Disease Category
```typescript
{
  name: string              // e.g., "Nutrition Deficiencies"
  slug: string              // URL-friendly identifier
  description?: string      // Category description
  icon?: string            // Lucide icon name
  order: number            // Display order
  isActive: boolean        // Visibility toggle
}
```

### Disease Information
```typescript
{
  name: string                    // Disease/deficiency name
  scientificName?: string         // Scientific name
  category: Reference             // Link to category
  severity: 'high' | 'medium' | 'low'
  mainImage: Image               // Primary reference image
  additionalImages?: Image[]     // Gallery images
  description: string            // Overview
  symptoms: string[]             // List of symptoms
  visualSigns?: string[]         // Visual indicators
  causes?: string[]              // Common causes
  treatment: string[]            // Treatment steps
  prevention?: string[]          // Prevention measures
  timing?: string                // Treatment timing
  criticalStages?: string        // Vulnerable stages
  commonRegions?: string[]       // Geographic info
  seasonality?: string           // Seasonal patterns
  economicImpact?: string        // Yield loss info
  expertNotes?: string           // Additional notes
  order: number                  // Display order
  isActive: boolean              // Visibility toggle
}
```

## 🔄 Migration from Old System

If you have existing disease data:

1. Run the migration script:
```bash
node scripts/migrate-to-sanity.js
```

2. This generates JSON files in `sanity-migration-data/`

3. Import to Sanity:
```bash
cd sanity
sanity dataset import ../sanity-migration-data/categories.ndjson production
```

4. Or manually add through Sanity Studio

## 🎨 Category Organization

The system supports multiple disease categories:

1. **Nutrition Deficiencies** 🌱
   - Nitrogen, Phosphorus, Potassium
   - Zinc, Iron, Sulfur
   - Micronutrient deficiencies

2. **Insect Damage** 🐛
   - Stem borers
   - Leaf folders
   - Plant hoppers
   - Other pests

3. **Fungal Diseases** 💧
   - Rice Blast
   - Brown Spot
   - Sheath Blight
   - False Smut

4. **Bacterial Diseases** ⚠️
   - Bacterial Leaf Blight
   - Bacterial Leaf Streak

5. **Viral Diseases** 🛡️
   - Rice Tungro
   - Rice Grassy Stunt

6. **Environmental Stress** ⚡
   - Heat stress
   - Cold damage
   - Salinity
   - Drought

## 🔧 Customization

### Adding New Categories

1. Go to Sanity Studio
2. Click "Disease Category"
3. Add new category with:
   - Name
   - Slug (auto-generated)
   - Icon name (from Lucide icons)
   - Order number
   - Mark as active

### Adding New Diseases

1. Go to Sanity Studio
2. Click "Disease Information"
3. Fill in all fields
4. Upload images
5. Link to appropriate category
6. Set order and activate

### Updating Existing Content

1. Find the disease in Sanity Studio
2. Edit any field
3. Publish changes
4. Changes appear immediately on frontend

## 🌐 Deployment

### Deploy Sanity Studio

```bash
cd sanity
npm run build
sanity deploy
```

Choose a hostname (e.g., `farm-disease-db`)

Your studio will be available at: `https://farm-disease-db.sanity.studio`

### Deploy Frontend

Deploy as usual with your Next.js hosting provider (Vercel, Netlify, etc.)

Ensure environment variables are set in your hosting platform.

## 🔐 Security & Access Control

1. **Sanity Studio Access**
   - Password-protected by default
   - Invite team members via Sanity dashboard
   - Role-based access control available

2. **API Security**
   - Public read access for frontend
   - Write access only through authenticated Studio
   - CORS configured for your domain

3. **Content Moderation**
   - All changes go through Sanity Studio
   - Version history available
   - Rollback capability

## 📱 Frontend Features

### Category Tabs
- Filter diseases by category
- "All" tab shows everything
- Icon-based navigation

### Disease Cards
- Severity badges (High/Medium/Low)
- Category labels
- Key symptoms preview
- Click to view full details

### Detail Modal
- Full disease information
- High-quality images
- Comprehensive treatment guide
- Prevention measures
- Expert notes

## 🐛 Troubleshooting

### Data not showing
- ✓ Check environment variables
- ✓ Verify Sanity project ID
- ✓ Ensure content is marked "Active"
- ✓ Check browser console for errors

### Images not loading
- ✓ Verify images uploaded in Sanity
- ✓ Check Sanity CDN accessibility
- ✓ Inspect network tab for image URLs

### Studio not loading
- ✓ Run `npm install` in sanity directory
- ✓ Check port 3333 is available
- ✓ Verify sanity.config.ts has correct project ID

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs)
- [Sanity Community Slack](https://slack.sanity.io)
- [Detailed Setup Guide](./SANITY_SETUP.md)

## 🤝 Contributing

To add new disease information:

1. Access Sanity Studio
2. Create new disease entry
3. Fill in all required fields
4. Upload quality reference images
5. Publish when ready

No code changes needed!

## 📝 License

Same as the main project license.

---

**Need Help?** Check [SANITY_SETUP.md](./SANITY_SETUP.md) for detailed instructions.

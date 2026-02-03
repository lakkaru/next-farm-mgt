# Sanity.io Integration for Disease Detection

This guide will help you set up Sanity.io for managing disease information in your farm management system.

## Overview

The disease detection page now uses Sanity.io as a headless CMS, allowing agricultural experts to:
- Add and manage disease information
- Upload reference images
- Organize diseases into categories (Nutrition Deficiencies, Insect Damage, Fungal Diseases, etc.)
- Update treatment protocols and prevention measures
- All changes reflect immediately on the frontend

## Setup Steps

### 1. Create a Sanity Account and Project

1. Go to [sanity.io](https://www.sanity.io) and sign up/login
2. Create a new project:
   ```bash
   cd sanity
   npm install
   npm create sanity@latest
   ```
3. Follow the prompts:
   - Choose "Yes" to create a new project
   - Give it a name (e.g., "Farm Management Disease DB")
   - Choose "production" as the dataset
   - Choose the project output path (use current directory)

4. Note your **Project ID** - you'll need this for configuration

### 2. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cd ../frontend
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Sanity credentials:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-02-03
   ```

### 3. Install Dependencies

```bash
# Install Sanity Studio dependencies
cd sanity
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Deploy Sanity Studio

You can run Sanity Studio locally or deploy it:

**Local Development:**
```bash
cd sanity
npm run dev
```
Studio will be available at http://localhost:3333

**Deploy to Sanity Cloud (Recommended):**
```bash
cd sanity
npm run build
sanity deploy
```
Choose a studio hostname (e.g., `farm-management-disease-db`)

### 5. Add Initial Content

1. Open Sanity Studio (locally or deployed)
2. Create Disease Categories first:
   - Nutrition Deficiencies (icon: Leaf, order: 1)
   - Insect Damage (icon: Bug, order: 2)
   - Fungal Diseases (icon: Droplets, order: 3)
   - Bacterial Diseases (icon: AlertCircle, order: 4)
   - Viral Diseases (icon: Shield, order: 5)
   - Environmental Stress (icon: Zap, order: 6)

3. Add Disease Information entries:
   - Select a category
   - Add name, scientific name, severity
   - Upload main image
   - Fill in symptoms, treatment, prevention, etc.
   - Set order for display sequence
   - Mark as active

### 6. Update Frontend to Use Sanity Data

Replace the old component with the new Sanity-powered one:

```typescript
// In your disease detection page file
// Change from:
import { DiseaseDetectionContent } from '@/components/paddy/disease-detection-content'

// To:
import { DiseaseDetectionContent } from '@/components/paddy/disease-detection-sanity'
```

### 7. Test the Integration

1. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the disease detection page
3. You should see data from Sanity
4. Try adding/editing content in Sanity Studio and refresh the page

## Content Structure

### Disease Categories
- **Name**: Category name (e.g., "Nutrition Deficiencies")
- **Slug**: URL-friendly identifier (auto-generated)
- **Description**: Brief description of the category
- **Icon**: Lucide icon name for display
- **Order**: Display order (lower numbers first)
- **Is Active**: Toggle visibility

### Disease Information
- **Name**: Disease/deficiency name
- **Scientific Name**: Scientific or chemical name
- **Category**: Reference to a disease category
- **Severity**: High/Medium/Low impact
- **Main Image**: Primary reference image
- **Additional Images**: Gallery of reference images
- **Description**: Overview of the condition
- **Symptoms**: List of identifying symptoms
- **Visual Signs**: Visual indicators
- **Causes**: Common causes
- **Treatment**: Step-by-step treatment protocol
- **Prevention**: Prevention measures
- **Timing**: When to apply treatment
- **Critical Stages**: Vulnerable growth stages
- **Common Regions**: Where it commonly occurs
- **Seasonality**: When it's most common
- **Economic Impact**: Yield loss information
- **Expert Notes**: Additional expert advice
- **Order**: Display order within category
- **Is Active**: Toggle visibility

## Features

### For Agricultural Experts (Content Managers)
- Easy-to-use interface for adding disease information
- Rich text editing capabilities
- Image upload and management
- Preview before publishing
- Version history and rollback
- Collaborative editing

### For Farmers (Frontend Users)
- Browse diseases by category
- Search and filter capabilities
- High-quality reference images
- Comprehensive treatment guides
- Mobile-responsive design
- Multi-language support (via i18n)

## API Access

The frontend fetches data using these queries:
- `getAllDiseases()` - Get all active diseases
- `getDiseaseCategories()` - Get all categories
- `getDiseasesByCategory(slug)` - Filter by category
- `getDiseaseById(id)` - Get single disease details

## Maintenance

### Adding New Diseases
1. Log into Sanity Studio
2. Go to "Disease Information"
3. Click "Create new"
4. Fill in all required fields
5. Upload images
6. Set to "Active"
7. Publish

### Updating Existing Content
1. Find the disease in Sanity Studio
2. Click to edit
3. Make changes
4. Publish
5. Changes appear immediately on frontend

### Managing Categories
1. Go to "Disease Category" in Sanity Studio
2. Add/edit categories as needed
3. Adjust order numbers to change display sequence

## Troubleshooting

### Data not showing on frontend
- Check environment variables are set correctly
- Verify Sanity project ID matches
- Ensure content is marked as "Active"
- Check browser console for errors

### Images not loading
- Verify images are uploaded in Sanity
- Check image URLs in browser network tab
- Ensure Sanity CDN is accessible

### Studio not loading
- Run `npm install` in sanity directory
- Check for port conflicts (default: 3333)
- Verify sanity.config.ts has correct project ID

## Migration from Old System

If you have existing disease data in the database:

1. Export existing data from MongoDB
2. Transform to Sanity format
3. Use Sanity's import API or manually add through Studio
4. Verify all data migrated correctly
5. Switch to new component
6. Keep old backend as fallback initially

## Security

- Sanity Studio should be password-protected
- Only grant access to trusted agricultural experts
- Use Sanity's role-based access control
- Enable CORS only for your frontend domain
- Regular backups of Sanity dataset

## Support

- Sanity Documentation: https://www.sanity.io/docs
- Sanity Community: https://slack.sanity.io
- Project Issues: Create an issue in your repository

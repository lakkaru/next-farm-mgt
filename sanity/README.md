# Sanity Studio

This directory contains the Sanity Studio configuration for managing disease information.

## Setup

1. Install dependencies:
```bash
cd sanity
npm install
```

2. Create a Sanity project:
```bash
npm create sanity@latest -- --project-id YOUR_PROJECT_ID --dataset production
```

3. Add environment variables to `frontend/.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-03
```

## Running the Studio

```bash
npm run dev
```

The studio will be available at http://localhost:3333

## Content Structure

### Disease Categories
- Nutrition Deficiencies
- Insect Damage
- Fungal Diseases
- Bacterial Diseases
- Viral Diseases
- Environmental Stress

### Disease Information
Each disease/deficiency entry includes:
- Name and scientific name
- Category
- Severity level
- Images (main + additional)
- Symptoms and visual signs
- Causes
- Treatment protocol
- Prevention measures
- Timing and critical stages
- Regional and seasonal information
- Economic impact
- Expert notes

## Adding Content

1. Start the studio: `npm run dev`
2. Navigate to http://localhost:3333
3. Create disease categories first
4. Add disease information entries linked to categories
5. Upload images for each disease
6. Content will automatically sync to the frontend

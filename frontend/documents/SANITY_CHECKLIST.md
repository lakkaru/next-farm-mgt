# Sanity.io Setup Checklist

Use this checklist to track your progress setting up Sanity.io for disease detection.

## Pre-Setup
- [ ] Read `SANITY_COMPLETE.md` for overview
- [ ] Read `SANITY_INTEGRATION.md` for quick start
- [ ] Ensure Node.js is installed (v18 or higher)
- [ ] Have project repository cloned

## Installation

### 1. Install Dependencies
- [ ] Run setup script:
  - [ ] Windows: `scripts\setup-sanity.bat`
  - [ ] Linux/Mac: `./scripts/setup-sanity.sh`
- [ ] OR manually install:
  - [ ] `cd sanity && npm install`
  - [ ] `cd frontend && npm install`

### 2. Create Sanity Project
- [ ] Run `cd sanity`
- [ ] Run `npm create sanity@latest`
- [ ] Follow prompts:
  - [ ] Create new project
  - [ ] Choose project name
  - [ ] Select "production" dataset
  - [ ] Note Project ID: ________________
  - [ ] Choose output path (current directory)

### 3. Configure Environment
- [ ] Navigate to `frontend` directory
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Edit `.env.local` with your values:
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID=_______________`
  - [ ] `NEXT_PUBLIC_SANITY_DATASET=production`
  - [ ] `NEXT_PUBLIC_SANITY_API_VERSION=2024-02-03`
- [ ] Save file

## Sanity Studio Setup

### 4. Start Sanity Studio
- [ ] Run `cd sanity`
- [ ] Run `npm run dev`
- [ ] Verify Studio opens at http://localhost:3333
- [ ] Log in with your Sanity account

### 5. Create Disease Categories
Create each category with these details:

- [ ] **Nutrition Deficiencies**
  - Name: "Nutrition Deficiencies"
  - Slug: Auto-generated
  - Description: "Nutrient deficiencies and toxicities affecting rice plants"
  - Icon: "Leaf"
  - Order: 1
  - Is Active: ✓

- [ ] **Insect Damage**
  - Name: "Insect Damage"
  - Slug: Auto-generated
  - Description: "Damage caused by various insects and pests"
  - Icon: "Bug"
  - Order: 2
  - Is Active: ✓

- [ ] **Fungal Diseases**
  - Name: "Fungal Diseases"
  - Slug: Auto-generated
  - Description: "Diseases caused by fungal pathogens"
  - Icon: "Droplets"
  - Order: 3
  - Is Active: ✓

- [ ] **Bacterial Diseases**
  - Name: "Bacterial Diseases"
  - Slug: Auto-generated
  - Description: "Diseases caused by bacterial pathogens"
  - Icon: "AlertCircle"
  - Order: 4
  - Is Active: ✓

- [ ] **Viral Diseases**
  - Name: "Viral Diseases"
  - Slug: Auto-generated
  - Description: "Diseases caused by viral pathogens"
  - Icon: "Shield"
  - Order: 5
  - Is Active: ✓

- [ ] **Environmental Stress**
  - Name: "Environmental Stress"
  - Slug: Auto-generated
  - Description: "Stress conditions from environmental factors"
  - Icon: "Zap"
  - Order: 6
  - Is Active: ✓

### 6. Add Sample Disease Information
Add at least one disease to test:

- [ ] Click "Disease Information" → "Create new"
- [ ] Fill in required fields:
  - [ ] Name: e.g., "Nitrogen Deficiency"
  - [ ] Scientific Name: e.g., "N Deficiency"
  - [ ] Category: Select "Nutrition Deficiencies"
  - [ ] Severity: Select level (High/Medium/Low)
  - [ ] Main Image: Upload a test image
  - [ ] Description: Add brief description
  - [ ] Symptoms: Add at least 2 symptoms
  - [ ] Treatment: Add at least 2 treatment steps
- [ ] Set "Is Active" to true
- [ ] Click "Publish"

## Frontend Integration

### 7. Update Frontend Component
- [ ] Locate your disease detection page file
- [ ] Change import from:
  ```typescript
  import { DiseaseDetectionContent } from '@/components/paddy/disease-detection-content'
  ```
- [ ] To:
  ```typescript
  import { DiseaseDetectionContent } from '@/components/paddy/disease-detection-sanity'
  ```
- [ ] Save file

### 8. Test Frontend
- [ ] Run `cd frontend`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Navigate to disease detection page
- [ ] Verify:
  - [ ] Categories appear as tabs
  - [ ] Sample disease shows in grid
  - [ ] Clicking disease opens detail modal
  - [ ] Images load correctly
  - [ ] All data displays properly

## Deployment (Optional)

### 9. Deploy Sanity Studio
- [ ] Run `cd sanity`
- [ ] Run `npm run build`
- [ ] Run `sanity deploy`
- [ ] Choose hostname: ________________
- [ ] Note Studio URL: ________________
- [ ] Test deployed Studio
- [ ] Invite team members if needed

### 10. Deploy Frontend
- [ ] Add environment variables to hosting platform:
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_SANITY_DATASET`
  - [ ] `NEXT_PUBLIC_SANITY_API_VERSION`
- [ ] Deploy frontend as usual
- [ ] Test production deployment
- [ ] Verify data loads correctly

## Content Population

### 11. Add More Diseases
For each disease category, add diseases:

**Nutrition Deficiencies:**
- [ ] Nitrogen (N)
- [ ] Phosphorus (P)
- [ ] Potassium (K)
- [ ] Zinc (Zn)
- [ ] Iron (Fe) Toxicity
- [ ] Sulfur (S)

**Fungal Diseases:**
- [ ] Rice Blast
- [ ] Brown Spot
- [ ] Sheath Blight
- [ ] False Smut
- [ ] Leaf Scald

**Bacterial Diseases:**
- [ ] Bacterial Leaf Blight
- [ ] Bacterial Leaf Streak

**Insect Damage:**
- [ ] Stem Borers
- [ ] Leaf Folders
- [ ] Plant Hoppers
- [ ] Rice Bugs

(Add more as needed)

### 12. Quality Check
For each disease entry, verify:
- [ ] Name is clear and descriptive
- [ ] Scientific name is accurate
- [ ] Category is correct
- [ ] Severity level is appropriate
- [ ] Main image is high quality
- [ ] Description is informative
- [ ] Symptoms are comprehensive
- [ ] Treatment steps are clear
- [ ] Prevention measures are included
- [ ] Expert notes are added (if applicable)
- [ ] Order is set correctly
- [ ] Is Active is checked

## Documentation Review

### 13. Team Training
- [ ] Share documentation with team:
  - [ ] `SANITY_INTEGRATION.md` - Overview
  - [ ] `SANITY_QUICK_REFERENCE.md` - Daily use
  - [ ] `SANITY_SETUP.md` - Detailed setup
- [ ] Train content managers on Sanity Studio
- [ ] Create content guidelines document
- [ ] Set up content review process

## Maintenance Setup

### 14. Ongoing Maintenance
- [ ] Schedule regular content reviews
- [ ] Set up backup process for Sanity dataset
- [ ] Create content update workflow
- [ ] Establish quality control process
- [ ] Monitor user feedback
- [ ] Plan for content expansion

## Troubleshooting

### Common Issues
If you encounter problems:

- [ ] **Data not showing:**
  - [ ] Check environment variables
  - [ ] Verify Sanity project ID
  - [ ] Ensure content is marked "Active"
  - [ ] Check browser console for errors

- [ ] **Images not loading:**
  - [ ] Verify images uploaded in Sanity
  - [ ] Check image URLs in network tab
  - [ ] Ensure Sanity CDN is accessible

- [ ] **Studio won't start:**
  - [ ] Reinstall dependencies: `npm install`
  - [ ] Check port 3333 is available
  - [ ] Verify sanity.config.ts has correct project ID

- [ ] **Build errors:**
  - [ ] Clear Next.js cache: `rm -rf .next`
  - [ ] Reinstall dependencies
  - [ ] Check TypeScript errors

## Success Criteria

Your setup is complete when:
- [ ] Sanity Studio is accessible and working
- [ ] All 6 categories are created
- [ ] At least 5 diseases are added with complete information
- [ ] Frontend displays Sanity data correctly
- [ ] Images load properly
- [ ] Category filtering works
- [ ] Detail modal shows all information
- [ ] Mobile view is responsive
- [ ] No console errors
- [ ] Content managers can add/edit diseases
- [ ] Changes appear immediately on frontend

## Next Steps After Setup

- [ ] Populate all disease categories
- [ ] Add high-quality reference images
- [ ] Invite agricultural experts to contribute
- [ ] Gather user feedback
- [ ] Plan content expansion
- [ ] Consider additional features
- [ ] Monitor usage and performance
- [ ] Regular content updates

---

## Notes

Use this space to track issues, ideas, or important information:

**Project ID:** ________________

**Studio URL:** ________________

**Deployment Date:** ________________

**Team Members:**
- ________________
- ________________
- ________________

**Issues Encountered:**
- ________________
- ________________

**Future Enhancements:**
- ________________
- ________________

---

**Completion Date:** ________________

**Completed By:** ________________

**Status:** [ ] In Progress  [ ] Complete  [ ] Deployed

---

Print this checklist and check off items as you complete them!

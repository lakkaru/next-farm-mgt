# Image Upload Implementation - Sanity Admin Panel

## Summary
Successfully replaced the disease management form's image URL text inputs with interactive file upload inputs that match Sanity Studio's UX.

## Changes Made

### 1. Form State (Lines 55-89)
Updated `diseaseForm` state to handle both File objects and preview URLs:
```typescript
diseaseForm: {
    // ... other fields ...
    mainImage: null as File | null,           // File object for main image
    mainImagePreview: '',                     // Preview URL for display
    additionalImages: [] as File[],           // Array of additional image files
    additionalImagesPreview: [] as string[],  // Preview URLs for additional images
}
```

### 2. Image Handling Functions (Lines 244-287)
Added three new functions to manage image uploads:

#### uploadImageToSanity()
- Uploads a single File to Sanity's asset store
- Makes POST request to `/api/sanity/upload` endpoint
- Returns assetId for use in disease document

#### handleMainImageChange()
- Triggered when user selects a main image file
- Creates object URL for preview display
- Updates state with file and preview

#### handleAdditionalImagesChange()
- Triggered when user selects multiple additional image files
- Appends new files to existing array
- Creates preview URLs for each file

### 3. Form Creation Handler (Lines 295-340)
**handleCreateDisease()** now:
1. Uploads main image if provided → gets mainImageAssetId
2. Uploads all additional images in parallel → gets additionalImageAssetIds
3. Sends disease data with image asset IDs to backend
4. Resets form after successful creation

### 4. Form Update Handler (Lines 342-380)
**handleUpdateDisease()** now:
1. Uploads only new image files
2. Preserves existing image references if not changed
3. Updates disease with new image asset IDs

### 5. Form UI - Main Image (Lines 933-966)
**Old:** Text input asking for image URL
**New:** 
- File input picker (accepts image/* files)
- Preview display showing selected/existing image (32x32)
- Remove button (✕) to clear selection

### 6. Form UI - Additional Images (Lines 968-1015)
**Old:** Multiple text input fields with add/remove buttons
**New:**
- Single multiple file input selector
- Grid display of previews (24x24 thumbnails, 3 columns)
- Individual remove buttons for each image
- Preserves ability to add more images

## Technical Details

### File Upload Flow
1. **User Action:** Selects file(s) via input element
2. **Preview:** Instant preview using `URL.createObjectURL()`
3. **Submit:** Form submit triggers upload handler
4. **Upload:** `uploadImageToSanity()` sends file to `/api/sanity/upload`
5. **Response:** Receives assetId back from server
6. **Storage:** Disease document saves with assetId reference
7. **Live:** Once published, images appear in public API

### State Management
- Separates files (`mainImage`, `additionalImages`) from previews
- Allows displaying existing Sanity images while accepting new uploads
- Supports both creation (no existing images) and updates (existing images preserved)

### API Integration
- Uses existing `/api/sanity/upload` endpoint
- Uses existing disease CRUD endpoints (`/api/sanity/diseases`)
- Sends asset IDs in POST/PATCH bodies for image references

### Styling
- Tailwind CSS classes for responsive layout
- Red remove buttons with hover effects
- Gray backgrounds for preview containers
- Responsive grid for multiple image previews

## Removed
- Old `mainImageUrl` state field (was text input)
- Old `additionalImagesUrls` state field (was array of URLs)
- Old form logic for managing URL string arrays
- All related event handlers for URL inputs

## No Breaking Changes
- All existing disease fields preserved
- CRUD operations unchanged
- API contracts remain the same
- Backward compatible with existing Sanity documents

## Testing Checklist
- [ ] Select main image → preview displays
- [ ] Remove main image → preview cleared
- [ ] Select multiple additional images → all preview in grid
- [ ] Remove individual additional image → removed from grid
- [ ] Submit form with images → images upload and disease created
- [ ] Edit existing disease → existing images show, can add new ones
- [ ] Images persist in Sanity after publish
- [ ] Images display in disease detection page

## Next Steps
1. Test image upload flow in the admin panel
2. Verify images persist in Sanity
3. Confirm images display in disease detection UI
4. Add image optimization if needed

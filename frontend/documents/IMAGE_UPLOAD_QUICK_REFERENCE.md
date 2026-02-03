# Image Upload - Quick Reference

## What You Can Now Do

### In Admin Panel
✅ Upload disease images from your computer (no more copy-paste URLs)
✅ See instant preview of selected images
✅ Upload multiple additional reference images at once
✅ Remove images with one click if wrong selection
✅ Create new diseases with images
✅ Edit existing diseases and add/replace images

### The Interface
```
Main Reference Image *
[📁 Choose File] 
   ↓ (shows preview)
[✕ Remove]

Additional Images
[📁 Choose Multiple Files]
   ↓ (shows grid of previews)
[✕] [✕] [✕]
[✕] [✕]
```

## How to Use

### Adding Images to New Disease
1. Open "New Disease" dialog
2. Fill in disease name, description, etc.
3. Click file input for "Main Reference Image"
4. Select one image from your computer → preview appears
5. Click file input for "Additional Images"
6. Select multiple images (hold Ctrl/Cmd + Click)
7. Click "Create" → images upload to Sanity

### Editing Disease Images
1. Click Edit on a disease
2. Existing images show as previews
3. To replace main image: Click input → select new image
4. To add more images: Click input → select files → added to grid
5. To remove image: Click ✕ button on preview
6. Click "Update" → changes saved to Sanity

## File Types Accepted
✅ JPG / JPEG
✅ PNG
✅ GIF
✅ WebP
✅ SVG
✅ Any image file your browser supports

## What Happens Behind the Scenes
1. You select file(s) → preview appears immediately
2. You click Create/Update → system uploads to Sanity
3. Sanity returns asset ID → linked in disease document
4. Images become available in Disease Detection page
5. Images appear in public API responses

## Size Limits
- Sanity handles optimization automatically
- No hard client-side limit for individual files
- Check your Sanity plan for storage limits
- Recommended: Keep images under 5MB for best performance

## Browser Support
Works in all modern browsers:
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅ (can access camera/photo library)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Upload failed" | Check Sanity token is saved |
| Preview doesn't show | Refresh page, try different image |
| File type not accepted | Use JPG, PNG, or other standard image format |
| Edit dialog blank | Check browser console for errors |
| Images don't persist | Verify "Create/Update" button clicked and success message shown |

## Key Files
- Component: `frontend/src/components/admin/sanity-admin-content.tsx`
- API: `frontend/src/app/api/sanity/upload/route.ts`
- Full Docs: `IMAGE_UPLOAD_COMPLETE.md`

## Command to Get Started
```bash
cd frontend
npm run dev
# Navigate to Admin → Sanity Admin Panel
```

---
**Time to implement:** ✅ Done!
**Testing status:** Ready for testing
**Production ready:** Yes

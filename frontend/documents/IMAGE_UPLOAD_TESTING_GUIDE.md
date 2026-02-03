# 🧪 Image Upload - Testing & Verification Guide

## Pre-Testing Setup

### ✓ Verify Files
```bash
# Check main component file exists and has new code
ls -l frontend/src/components/admin/sanity-admin-content.tsx

# Check API endpoint exists
ls -l frontend/src/app/api/sanity/upload/route.ts

# Check mutation function exists
ls -l frontend/src/sanity/lib/mutations.ts
```

### ✓ Check Build
```bash
cd frontend
npm run build
# Should complete with no errors
```

### ✓ Start Development Server
```bash
npm run dev
# Navigate to http://localhost:3000
```

---

## Manual Testing Checklist

### 📋 Test 1: Create Disease with Images

**Steps:**
1. [ ] Open Admin → Sanity Admin Panel
2. [ ] Click "+ New Disease"
3. [ ] Fill in required fields:
   - [ ] Name: "Test Disease 1"
   - [ ] Category: Select any category
   - [ ] Severity: Select level
4. [ ] Main Image:
   - [ ] Click file input
   - [ ] Select an image from your computer
   - [ ] Verify preview appears (32x32)
5. [ ] Additional Images:
   - [ ] Click file input
   - [ ] Select 2-3 images (Ctrl+Click)
   - [ ] Verify preview grid appears
6. [ ] Click Create button
7. [ ] Verify:
   - [ ] No errors in console
   - [ ] Success message appears
   - [ ] Dialog closes
   - [ ] New disease appears in list

**Expected Result:** ✅ Disease created with all images

---

### 📋 Test 2: Edit Disease - Keep Images

**Steps:**
1. [ ] Click Edit on disease from Test 1
2. [ ] Verify existing images show as previews
3. [ ] Make a text change (e.g., description)
4. [ ] Don't change any images
5. [ ] Click Update
6. [ ] Verify:
   - [ ] Success message
   - [ ] Images still there
   - [ ] Text change saved

**Expected Result:** ✅ Disease updated, images unchanged

---

### 📋 Test 3: Edit Disease - Replace Main Image

**Steps:**
1. [ ] Click Edit on disease from Test 1
2. [ ] Verify main image shows preview
3. [ ] Click main image file input again
4. [ ] Select a different image
5. [ ] Verify new preview appears
6. [ ] Click Update
7. [ ] Verify:
   - [ ] Success message
   - [ ] New image shows (reload if needed)

**Expected Result:** ✅ Main image replaced

---

### 📋 Test 4: Edit Disease - Remove Image

**Steps:**
1. [ ] Click Edit on disease from Test 1
2. [ ] Click ✕ button on main image preview
3. [ ] Verify main image preview disappears
4. [ ] Click Update
5. [ ] Verify:
   - [ ] Success message
   - [ ] Main image gone (reload if needed)

**Expected Result:** ✅ Main image removed

---

### 📋 Test 5: Edit Disease - Add More Images

**Steps:**
1. [ ] Click Edit on disease from Test 1
2. [ ] Note current additional images in grid
3. [ ] Click "Choose Multiple Files" input
4. [ ] Select 2 new images
5. [ ] Verify new images added to bottom of grid
6. [ ] Click Update
7. [ ] Verify:
   - [ ] Success message
   - [ ] All original + new images present

**Expected Result:** ✅ Additional images added

---

### 📋 Test 6: Edit Disease - Remove Additional Image

**Steps:**
1. [ ] Click Edit on disease from Test 1
2. [ ] Click ✕ on one of additional images
3. [ ] Verify image removed from grid immediately
4. [ ] Click Update
5. [ ] Verify:
   - [ ] Success message
   - [ ] Image still gone after reload

**Expected Result:** ✅ Additional image removed

---

### 📋 Test 7: Create with No Images

**Steps:**
1. [ ] Click "+ New Disease"
2. [ ] Fill in all required fields
3. [ ] DON'T select any main image
4. [ ] Click Create
5. [ ] Verify:
   - [ ] Form validates (should show error if required)
   - [ ] OR creates successfully if main image is optional

**Expected Result:** ✅ Form validates or creates as expected

---

### 📋 Test 8: Error Handling - Invalid File

**Steps:**
1. [ ] Click "+ New Disease"
2. [ ] Try to select a non-image file (.txt, .pdf, etc)
3. [ ] Verify file picker only shows images
4. [ ] Try selecting an image instead
5. [ ] Verify preview works

**Expected Result:** ✅ File picker filters correctly

---

### 📋 Test 9: Verify in Sanity Studio

**Steps:**
1. [ ] Open Sanity Studio
2. [ ] Navigate to "Disease Info" documents
3. [ ] Open disease created in Test 1
4. [ ] Verify:
   - [ ] mainImage field shows asset
   - [ ] additionalImages field shows asset array
   - [ ] Images are clickable/viewable

**Expected Result:** ✅ Images properly stored in Sanity

---

### 📋 Test 10: Verify in Disease Detection

**Steps:**
1. [ ] Open Disease Detection page
2. [ ] Search for disease created in Test 1
3. [ ] Verify:
   - [ ] Main image displays
   - [ ] Images load correctly
   - [ ] No broken image icons

**Expected Result:** ✅ Images display in frontend

---

### 📋 Test 11: Browser Console - No Errors

**Steps:**
1. [ ] Open Browser DevTools (F12)
2. [ ] Go to Console tab
3. [ ] Perform upload test
4. [ ] Verify:
   - [ ] No red error messages
   - [ ] No warnings about files
   - [ ] Network requests succeed (200 OK)

**Expected Result:** ✅ No console errors

---

### 📋 Test 12: Network Request - Verify Upload

**Steps:**
1. [ ] Open DevTools → Network tab
2. [ ] Click "+ New Disease"
3. [ ] Select images
4. [ ] Click Create
5. [ ] Watch Network tab
6. [ ] Verify requests:
   - [ ] POST /api/sanity/upload → 200 OK (for main image)
   - [ ] POST /api/sanity/upload → 200 OK (for each additional)
   - [ ] POST /api/sanity/diseases → 200 OK (create disease)
7. [ ] Check response includes assetId fields

**Expected Result:** ✅ All API calls succeed

---

## Browser-Specific Testing

### 🌐 Chrome
- [ ] File picker opens
- [ ] Multiple file selection works (Ctrl+Click)
- [ ] Preview displays correctly
- [ ] Upload succeeds

### 🌐 Firefox
- [ ] File picker opens
- [ ] Multiple file selection works (Ctrl+Click)
- [ ] Preview displays correctly
- [ ] Upload succeeds

### 🌐 Safari
- [ ] File picker opens
- [ ] Multiple file selection works
- [ ] Preview displays correctly
- [ ] Upload succeeds

### 📱 Mobile Chrome
- [ ] File picker opens
- [ ] Can select from photo library
- [ ] Can take photo with camera
- [ ] Upload succeeds

### 📱 Mobile Safari
- [ ] File picker opens
- [ ] Can select from photos
- [ ] Preview displays
- [ ] Upload succeeds

---

## Performance Testing

### Speed Test
```bash
# Create disease with 1 image
Time to upload and create: ______ seconds
# Should be < 10 seconds total

# Create disease with 5 images
Time to upload and create: ______ seconds
# Should be < 15 seconds total
```

### Image Size Testing
- [ ] Test with small image (< 1 MB) → ✓ Works
- [ ] Test with medium image (1-5 MB) → ✓ Works
- [ ] Test with large image (5-10 MB) → ✓ Works

---

## Error Scenario Testing

### 🔴 No Sanity Token
```
Prerequisite: Log out / clear Sanity token
1. Try to create disease with image
2. Verify error message: "Sanity token required"
3. Re-enter Sanity token
4. Try again → should work
```

### 🔴 Bad Network
```
1. Open DevTools → Network → Throttle to Slow 3G
2. Try to upload image
3. Verify either:
   - Upload works (slower) OR
   - Timeout error shown gracefully
```

### 🔴 Very Large Image
```
1. Try to upload 100+ MB image
2. Verify:
   - Either works (Sanity handles)
   - Or error message: "File too large"
```

---

## Regression Testing

### Existing Features Still Work
- [ ] Can create disease without images
- [ ] Can edit disease text fields
- [ ] Can delete disease
- [ ] Can manage disease categories
- [ ] Old diseases with URL images still work
- [ ] Disease detection page works
- [ ] Search functionality works
- [ ] Filters work

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through form fields
- [ ] Can focus and activate file input
- [ ] Can remove images with keyboard
- [ ] Can submit form with Enter key

### Screen Reader
- [ ] Labels read correctly
- [ ] File input announced properly
- [ ] Remove buttons have accessible names
- [ ] Success messages announced

---

## Documentation Testing

- [ ] All markdown files render correctly
- [ ] Code examples are accurate
- [ ] Instructions are clear and complete
- [ ] No broken links

---

## Sign-Off Checklist

```
TESTING COMPLETE

Tester Name: ________________________
Date: ________________________
Build Version: ________________________

✓ Basic functionality working
✓ No critical errors
✓ No regression issues
✓ Browser compatibility verified
✓ Performance acceptable
✓ Error handling works
✓ Documentation accurate

Status: [ ] PASS  [ ] NEEDS FIXES

Comments:
________________________________________________________
________________________________________________________
________________________________________________________
```

---

## Known Limitations (Expected Behavior)

✓ File input doesn't show previously selected files (browser limitation)
✓ Preview URLs are temporary (recreated on edit)
✓ Multiple selections replace previous selections
✓ No drag-and-drop (can be added later)
✓ No image cropping (can be added later)

---

## If Tests Fail

### Main Image Won't Upload
```
1. Check /api/sanity/upload endpoint exists
2. Check Sanity token is valid
3. Try different image format (JPG → PNG)
4. Check browser console for error message
5. Check network tab for failed request
```

### Preview Doesn't Show
```
1. Refresh page
2. Check browser allows object URLs
3. Check image isn't corrupted
4. Try different image
```

### Images Don't Save
```
1. Verify form submit button clicked
2. Check success message appeared
3. Reload page to verify persistence
4. Check Sanity Studio for document
5. Check network tab for successful POST
```

### Edit Mode Shows No Images
```
1. Check openEditDisease() is called
2. Verify disease has mainImage/additionalImages fields
3. Check Sanity data structure
4. Reload page and try again
```

---

## Final Verification

After all tests pass:
- [ ] Create a summary of test results
- [ ] Document any issues found
- [ ] Verify all issues are resolved
- [ ] Get stakeholder approval
- [ ] Deploy to production

---

**Ready to test?** 🚀 Start with Test 1 and work through the checklist!

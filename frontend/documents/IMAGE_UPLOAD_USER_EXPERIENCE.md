# Image Upload - What You'll See

## Before Implementation (Previous State)
```
┌─────────────────────────────────────────────┐
│         New Disease Form                    │
├─────────────────────────────────────────────┤
│ Name *                                      │
│ [Text Input: Disease name...]               │
│                                             │
│ Scientific Name                             │
│ [Text Input: Scientific name...]            │
│                                             │
│ Category *                                  │
│ [Dropdown: Select category...]              │
│                                             │
│ Main Reference Image URL *                  │
│ [Text Input: Enter image URL...]           │
│    ^ User had to paste URL manually        │
│                                             │
│ Additional Images (URLs)                    │
│ [Text Input: Enter image URL...]           │
│ [Text Input: Enter image URL...]           │
│ [Text Input: Enter image URL...]           │
│ [+ Add Image URL]  <- Multiple inputs     │
│                                             │
│                    [Cancel]  [Create]      │
└─────────────────────────────────────────────┘
```

## After Implementation (Current State)
```
┌─────────────────────────────────────────────┐
│         New Disease Form                    │
├─────────────────────────────────────────────┤
│ Name *                                      │
│ [Text Input: Disease name...]               │
│                                             │
│ Scientific Name                             │
│ [Text Input: Scientific name...]            │
│                                             │
│ Category *                                  │
│ [Dropdown: Select category...]              │
│                                             │
│ Main Reference Image *                      │
│ [📁 Choose File]  ← File picker!           │
│                                             │
│ ┌────────────────────┐                     │
│ │  [Preview Image]   │ ✕ Remove button    │
│ │     32x32px        │                     │
│ └────────────────────┘                     │
│                                             │
│ Additional Images                           │
│ [📁 Choose Multiple Files]                 │
│                                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ Image 1  │ │ Image 2  │ │ Image 3  │    │
│ │   24x24  │ │   24x24  │ │   24x24  │    │
│ │    ✕     │ │    ✕     │ │    ✕     │    │
│ └──────────┘ └──────────┘ └──────────┘    │
│ ┌──────────┐ ┌──────────┐                 │
│ │ Image 4  │ │ Image 5  │                 │
│ │   24x24  │ │   24x24  │                 │
│ │    ✕     │ │    ✕     │                 │
│ └──────────┘ └──────────┘                 │
│                                             │
│                    [Cancel]  [Create]      │
└─────────────────────────────────────────────┘
```

## Step-by-Step User Flow

### 1. Navigate to Admin Panel
```
Header Menu: [Dashboard] [Admin] [Logout]
                           ↓
             [General Settings]
             [User Management]
             [Sanity Admin Panel] ← Click here
```

### 2. Click "New Disease"
```
┌────────────────────────────────────┐
│ Sanity Admin Panel                 │
├────────────────────────────────────┤
│ [+ New Disease] [Refresh]          │
│                                    │
│ List of existing diseases...       │
└────────────────────────────────────┘
            ↓ Click [+ New Disease]
```

### 3. See Empty Form
```
Disease form appears with empty fields
and file input ready for images
```

### 4. Click Main Image File Picker
```
┌─────────────────────────────────────────┐
│ Main Reference Image *                  │
│ [📁 Choose File]  ← Click this        │
│                  ↓
   Browser opens file picker dialog
   
   [Cancel] [Open]
   ┌─────────────────────────────────┐
   │ Select Image File               │
   │                                 │
   │ [📁 Pictures]                   │
   │   [📄 rice-blast.jpg]           │
   │   [📄 brown-spot.png]           │
   │   [📄 leaf-scald.gif]           │
   │                                 │
   │ File name: [rice-blast.jpg___]  │
   └─────────────────────────────────┘
```

### 5. Select Image & See Preview
```
User selects rice-blast.jpg → dialog closes

┌─────────────────────────────────────────┐
│ Main Reference Image *                  │
│ [📁 Choose File]                        │
│                                         │
│ Preview appears:                        │
│ ┌─────────────────┐                    │
│ │  [Disease Pic]  │ ✕                  │
│ │     32x32px     │                    │
│ └─────────────────┘                    │
│                                         │
│ Looks good! Ready to add more.         │
└─────────────────────────────────────────┘
```

### 6. Click Additional Images File Picker
```
┌──────────────────────────────────────────┐
│ Additional Images                        │
│ [📁 Choose Multiple Files]  ← Click    │
│                           ↓
   Browser opens multi-select file picker
   
   Hold Ctrl/Cmd + Click to select multiple
   
   [Cancel] [Open]
   ┌──────────────────────────────────┐
   │ Select Images (Multiple OK)       │
   │ ☑ brown-spot.png                 │
   │ ☑ sheath-blight.jpg              │
   │ ☑ false-smut.png                 │
   │                                  │
   │ File name: [3 files selected]    │
   └──────────────────────────────────┘
```

### 7. See Preview Grid
```
User selects 3 images → dialog closes

┌──────────────────────────────────────────┐
│ Additional Images                        │
│ [📁 Choose Multiple Files]               │
│                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ brown-   │ │ sheath-  │ │ false-   │ │
│ │ spot.png │ │ blight   │ │ smut.png │ │
│ │   24x24  │ │   24x24  │ │   24x24  │ │
│ │    ✕     │ │    ✕     │ │    ✕     │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                          │
│ All images shown! Can add more if needed │
└──────────────────────────────────────────┘
```

### 8. Remove Image if Wrong
```
User clicks ✕ on brown-spot.png

┌──────────────────────────────────────────┐
│ Additional Images                        │
│ [📁 Choose Multiple Files]               │
│                                          │
│ ┌──────────┐ ┌──────────┐               │
│ │ sheath-  │ │ false-   │               │
│ │ blight   │ │ smut.png │               │
│ │   24x24  │ │   24x24  │               │
│ │    ✕     │ │    ✕     │               │
│ └──────────┘ └──────────┘               │
│                                          │
│ Image removed immediately!              │
└──────────────────────────────────────────┘
```

### 9. Fill Rest of Form
```
User fills in:
- Name: "Brown Spot Disease"
- Scientific Name: "Bipolaris oryzae"
- Category: "Fungal Disease"
- Severity: "High"
- Description: "Common rice disease..."
- Symptoms: Add symptoms...
- Treatment: Add treatments...
- ... other fields ...
```

### 10. Click Create Button
```
┌──────────────────────────────────────────┐
│                           [Cancel] [Create]
│                                      ↓
```

### 11. See Upload Progress
```
Dialog remains open
Status shows: "Uploading images..."

Internally:
1. System uploads main image → gets assetId
2. System uploads additional images in parallel → gets assetIds
3. System creates disease document with assetIds
```

### 12. See Success Message
```
Dialog closes
Success message appears:
┌──────────────────────────────────────────┐
│ ✓ Disease created successfully!          │
│                                          │
│ New disease "Brown Spot Disease" created │
│ with 4 images uploaded to Sanity         │
└──────────────────────────────────────────┘

Disease appears in list:
┌──────────────────────────────────────────┐
│ Brown Spot Disease                       │
│ Fungal Disease • High Severity           │
│ [Edit] [Delete] [Manage Images]          │
└──────────────────────────────────────────┘
```

## Editing Existing Disease

### 1. Click Edit
```
Disease list item → Click [Edit]
```

### 2. See Existing Images
```
┌──────────────────────────────────────────┐
│ Main Reference Image *                   │
│ [📁 Choose File]                         │
│                                          │
│ ┌──────────────────┐                    │
│ │ [Current Image]  │ ✕ (can remove)    │
│ │     32x32px      │                    │
│ └──────────────────┘                    │
│                                          │
│ Additional Images                        │
│ [📁 Choose Multiple Files]               │
│                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Image 1  │ │ Image 2  │ │ Image 3  │ │
│ │   24x24  │ │   24x24  │ │   24x24  │ │
│ │    ✕     │ │    ✕     │ │    ✕     │ │
│ └──────────┘ └──────────┘ └──────────┘ │
└──────────────────────────────────────────┘
```

### 3. Options Available
```
A) Keep everything as-is
   → Click [Update] → No changes

B) Replace main image
   → Click file input → Select new image
   → Old preview replaced
   → Click [Update]

C) Remove images
   → Click ✕ button(s)
   → Images removed from preview
   → Click [Update]

D) Add more images
   → Click "Choose Multiple Files"
   → Select new images
   → Added to preview grid
   → Click [Update]

E) Replace main + keep/modify additional
   → Combine any of above
   → Click [Update]
```

## What User Sees After Upload

### In Sanity Studio
```
Disease document shows:
- mainImage: { asset: { _id: "..." } }
- additionalImages: [ 
    { asset: { _id: "..." } },
    { asset: { _id: "..." } },
    { asset: { _id: "..." } }
  ]
```

### In Disease Detection Page
```
Disease Card:
┌────────────────────────┐
│ [Disease Image]        │
├────────────────────────┤
│ Brown Spot Disease     │
│ Fungal • High Risk     │
│                        │
│ [View Details]         │
└────────────────────────┘

Details Page:
Main image shows prominently
Gallery of additional images below
```

## Error Scenarios

### Error 1: Token Not Saved
```
User clicks Create → Error
┌──────────────────────────────────────────┐
│ ✗ Error: Sanity token required           │
│                                          │
│ Please save your Sanity token in admin   │
│ settings before uploading images.        │
└──────────────────────────────────────────┘
```

### Error 2: Invalid Image
```
User selects non-image file → Error
┌──────────────────────────────────────────┐
│ ✗ Error: Invalid file type               │
│                                          │
│ Please select an image file (JPG, PNG,   │
│ GIF, WebP, etc.)                         │
└──────────────────────────────────────────┘
```

### Error 3: Upload Failed
```
Network error during upload → Error
┌──────────────────────────────────────────┐
│ ✗ Error: Failed to upload image          │
│                                          │
│ Check your connection and try again.     │
│ Check browser console for more details.  │
└──────────────────────────────────────────┘
```

---

## Visual Summary

| Element | Before | After |
|---------|--------|-------|
| Main Image Input | Text field | File picker |
| Main Image Preview | None | 32x32 thumbnail |
| Additional Images | Multiple text fields | File picker |
| Additional Images Preview | None | 3-column grid |
| Remove Images | Delete text, add new | Click ✕ button |
| Visual Feedback | URL text | Image preview |
| User Experience | Copy-paste URLs | Pick files |

---

**This is what your users will experience when using the image upload feature!** 🎉

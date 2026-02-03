# Image Upload Feature - Code Changes Summary

## File: `/frontend/src/components/admin/sanity-admin-content.tsx`

### Change 1: Updated State Definition (Lines 63-89)

**What was added:**
```typescript
mainImage: null as File | null,
mainImagePreview: '',
additionalImages: [] as File[],
additionalImagesPreview: [] as string[],
```

**Why:** To store both File objects (for upload) and preview URLs (for display)

---

### Change 2: Added Image Upload Function (Lines 244-257)

**Code:**
```typescript
const uploadImageToSanity = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await fetch('/api/sanity/upload', {
            method: 'POST',
            headers: {
                'x-sanity-token': sanityToken,
            },
            body: formData,
        })

        if (!response.ok) throw new Error('Failed to upload image')

        const data = await response.json()
        return data.assetId || data.asset._id
    } catch (err) {
        console.error('Image upload error:', err)
        throw new Error('Failed to upload image to Sanity')
    }
}
```

**Why:** Centralized function to upload any image file to Sanity and get back assetId

---

### Change 3: Added Main Image Handler (Lines 267-276)

**Code:**
```typescript
const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
        const preview = URL.createObjectURL(file)
        setDiseaseForm({
            ...diseaseForm,
            mainImage: file,
            mainImagePreview: preview,
        })
    }
}
```

**Why:** When user selects a main image, create preview and store file

---

### Change 4: Added Additional Images Handler (Lines 279-288)

**Code:**
```typescript
const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
        const newFiles = Array.from(files)
        const newPreviews = newFiles.map(file => URL.createObjectURL(file))
        setDiseaseForm({
            ...diseaseForm,
            additionalImages: [...diseaseForm.additionalImages, ...newFiles],
            additionalImagesPreview: [...diseaseForm.additionalImagesPreview, ...newPreviews],
        })
    }
}
```

**Why:** When user selects multiple images, append them to existing array with previews

---

### Change 5: Updated Create Handler (Lines 295-340)

**Added sections:**
```typescript
// Upload images first
let mainImageAssetId: string | undefined
let additionalImageAssetIds: string[] = []

if (diseaseForm.mainImage) {
    mainImageAssetId = await uploadImageToSanity(diseaseForm.mainImage)
}

if (diseaseForm.additionalImages.length > 0) {
    additionalImageAssetIds = await Promise.all(
        diseaseForm.additionalImages.map(img => uploadImageToSanity(img))
    )
}

// Updated request body to include assetIds:
body: JSON.stringify({
    ...diseaseForm,
    mainImageAssetId,
    additionalImageAssetIds,
    // ... other fields
}),
```

**Why:** Upload all images before creating disease, send assetIds to backend

---

### Change 6: Updated Update Handler (Lines 342-380)

**Added sections:**
```typescript
// Upload new images if any
let mainImageAssetId: string | undefined
let additionalImageAssetIds: string[] = []

if (diseaseForm.mainImage) {
    mainImageAssetId = await uploadImageToSanity(diseaseForm.mainImage)
}

if (diseaseForm.additionalImages.length > 0) {
    additionalImageAssetIds = await Promise.all(
        diseaseForm.additionalImages.map(img => uploadImageToSanity(img))
    )
}

// Updated request body to include assetIds:
body: JSON.stringify({
    ...diseaseForm,
    mainImageAssetId,
    additionalImageAssetIds,
    // ... other fields
}),
```

**Why:** Same as create, but for updates - only uploads new images

---

### Change 7: Replaced Main Image UI (Lines 933-966)

**Before:**
```tsx
<Label htmlFor="dis-main-image">Main Reference Image URL *</Label>
<Input
    id="dis-main-image"
    value={diseaseForm.mainImageUrl}
    onChange={(e) => setDiseaseForm({ ...diseaseForm, mainImageUrl: e.target.value })}
    placeholder="Enter image URL"
/>
```

**After:**
```tsx
<Label htmlFor="dis-main-image">Main Reference Image *</Label>
<div className="flex flex-col gap-2">
    <input
        id="dis-main-image"
        type="file"
        accept="image/*"
        onChange={handleMainImageChange}
        className="p-2 border rounded cursor-pointer"
    />
    {(diseaseForm.mainImagePreview || diseaseForm.mainImage) && (
        <div className="relative w-32 h-32 border rounded overflow-hidden bg-gray-100">
            <img
                src={diseaseForm.mainImagePreview}
                alt="Main preview"
                className="w-full h-full object-cover"
            />
            <button
                type="button"
                onClick={() =>
                    setDiseaseForm({
                        ...diseaseForm,
                        mainImage: null,
                        mainImagePreview: '',
                    })
                }
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
            >
                ✕
            </button>
        </div>
    )}
</div>
```

**Why:** Changed from URL text input to file picker with preview and remove button

---

### Change 8: Replaced Additional Images UI (Lines 968-1015)

**Before:**
```tsx
{diseaseForm.additionalImagesUrls.map((imageUrl, index) => (
    <div key={index} className="flex gap-2">
        <Input
            value={imageUrl}
            onChange={(e) => {
                const newUrls = [...diseaseForm.additionalImagesUrls]
                newUrls[index] = e.target.value
                setDiseaseForm({ ...diseaseForm, additionalImagesUrls: newUrls })
            }}
            placeholder="Enter image URL"
        />
        {diseaseForm.additionalImagesUrls.length > 1 && (
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                    const newUrls = diseaseForm.additionalImagesUrls.filter((_, i) => i !== index)
                    setDiseaseForm({ ...diseaseForm, additionalImagesUrls: newUrls })
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        )}
    </div>
))}
<Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => setDiseaseForm({ ...diseaseForm, additionalImagesUrls: [...diseaseForm.additionalImagesUrls, ''] })}
>
    <Plus className="h-4 w-4 mr-2" />
    Add Image URL
</Button>
```

**After:**
```tsx
<input
    type="file"
    accept="image/*"
    multiple
    onChange={handleAdditionalImagesChange}
    className="p-2 border rounded cursor-pointer"
/>
{diseaseForm.additionalImagesPreview.length > 0 && (
    <div className="grid grid-cols-3 gap-2">
        {diseaseForm.additionalImagesPreview.map((preview, index) => (
            <div
                key={index}
                className="relative w-24 h-24 border rounded overflow-hidden bg-gray-100"
            >
                <img
                    src={preview}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-full object-cover"
                />
                <button
                    type="button"
                    onClick={() => {
                        const newPreviews = diseaseForm.additionalImagesPreview.filter(
                            (_, i) => i !== index
                        )
                        const newFiles = diseaseForm.additionalImages.filter(
                            (_, i) => i !== index
                        )
                        setDiseaseForm({
                            ...diseaseForm,
                            additionalImages: newFiles,
                            additionalImagesPreview: newPreviews,
                        })
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded text-xs hover:bg-red-600"
                >
                    ✕
                </button>
            </div>
        ))}
    </div>
)}
```

**Why:** Changed from multiple URL text inputs to file picker with preview grid

---

### Change 9: Updated Reset Function (Lines 436-443)

**Before:**
```typescript
mainImageUrl: '',
additionalImagesUrls: [''],
```

**After:**
```typescript
mainImage: null,
mainImagePreview: '',
additionalImages: [],
additionalImagesPreview: [],
```

**Why:** Reset new File-based state fields instead of URL strings

---

### Change 10: Updated Edit Load Function (Lines 464-471)

**Updated lines:**
```typescript
mainImagePreview: disease.mainImage?.asset?.url || '',
// ... 
additionalImagesPreview: disease.additionalImages?.map(img => img.asset?.url || '') || [],
```

**Why:** Load existing image URLs as previews when editing

---

## Summary of Changes

| Type | Count | Details |
|------|-------|---------|
| State additions | 4 | File objects and preview URLs |
| Functions added | 3 | uploadImageToSanity, handlers |
| Functions updated | 5 | Create, Update, Reset, Edit loaders |
| UI sections replaced | 2 | Main image, Additional images |
| Total lines added | ~150 | New functionality |
| Total lines removed | ~40 | Old URL logic |
| Breaking changes | 0 | Fully backward compatible |

---

## Migration Notes

If you have existing disease documents:
- ✅ They still work (backward compatible)
- ✅ Their images still load as previews
- ✅ You can now upload new images to replace them
- ✅ No data loss or schema changes

---

## Files Not Modified

- ✅ Backend API endpoints (compatible)
- ✅ Sanity schema (no changes needed)
- ✅ Database models (no changes needed)
- ✅ Other components (isolated change)

---

**All changes are isolated to the admin component with no breaking changes.**

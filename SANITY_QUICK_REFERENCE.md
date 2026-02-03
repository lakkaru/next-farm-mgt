# Sanity.io Quick Reference Card

## 🚀 Quick Start Commands

### First Time Setup
```bash
# Windows
scripts\setup-sanity.bat

# Linux/Mac
./scripts/setup-sanity.sh
```

### Create Sanity Project
```bash
cd sanity
npm create sanity@latest
# Note your Project ID!
```

### Configure Environment
```bash
cd frontend
# Edit .env.local with:
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-03
```

### Start Development
```bash
# Terminal 1: Sanity Studio
cd sanity
npm run dev
# Opens at http://localhost:3333

# Terminal 2: Frontend
cd frontend
npm run dev
# Opens at http://localhost:3000
```

## 📝 Common Tasks

### Add New Disease Category
1. Open Sanity Studio (http://localhost:3333)
2. Click "Disease Category" → "Create new"
3. Fill in:
   - Name: e.g., "Insect Damage"
   - Slug: Auto-generated from name
   - Description: Brief description
   - Icon: Lucide icon name (e.g., "Bug")
   - Order: Display order number
   - Is Active: ✓ Check to show
4. Click "Publish"

### Add New Disease Information
1. Open Sanity Studio
2. Click "Disease Information" → "Create new"
3. Fill in required fields:
   - Name: Disease/deficiency name
   - Category: Select from dropdown
   - Severity: High/Medium/Low
   - Main Image: Upload image
   - Description: Brief overview
   - Symptoms: Add list items
   - Treatment: Add list items
4. Fill optional fields as needed
5. Set "Is Active" to true
6. Click "Publish"

### Update Existing Disease
1. Open Sanity Studio
2. Find disease in "Disease Information"
3. Click to edit
4. Make changes
5. Click "Publish"
6. Changes appear immediately on frontend

### Upload Images
1. In disease form, click "Main Image"
2. Click "Upload" or drag & drop
3. Add alt text for accessibility
4. For additional images, click "Add item"
5. Upload and caption each image

### Reorder Diseases
1. Edit disease entry
2. Change "Order" field number
3. Lower numbers appear first
4. Publish changes

## 🔍 GROQ Query Examples

### Get All Active Diseases
```groq
*[_type == "diseaseInfo" && isActive == true] | order(order asc)
```

### Get Diseases by Category
```groq
*[_type == "diseaseInfo" && category->slug.current == "nutrition-deficiencies"]
```

### Get Single Disease
```groq
*[_type == "diseaseInfo" && _id == $id][0]
```

### Get Categories with Disease Count
```groq
*[_type == "diseaseCategory"] {
  ...,
  "diseaseCount": count(*[_type == "diseaseInfo" && references(^._id)])
}
```

## 🎨 Available Icons (Lucide)

Common icons for categories:
- `Leaf` - Nutrition/Plant health
- `Bug` - Insects/Pests
- `Droplets` - Fungal/Water-related
- `AlertCircle` - Bacterial/Warnings
- `Shield` - Viral/Protection
- `Zap` - Environmental/Stress
- `Sprout` - Growth-related
- `Wind` - Weather-related

[Full list](https://lucide.dev/icons/)

## 🛠️ Troubleshooting

### Data Not Showing
```bash
# Check environment variables
cat frontend/.env.local  # Linux/Mac
type frontend\.env.local  # Windows

# Verify Sanity connection
cd frontend
npm run dev
# Check browser console for errors
```

### Images Not Loading
```bash
# Verify image URLs in Sanity
# Check Network tab in browser DevTools
# Ensure CORS is configured in Sanity
```

### Studio Won't Start
```bash
# Reinstall dependencies
cd sanity
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend Build Errors
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

## 📊 Severity Levels

| Level | Badge Color | Use Case |
|-------|-------------|----------|
| `high` | Red | Severe diseases, major deficiencies |
| `medium` | Yellow | Moderate impact conditions |
| `low` | Green | Minor issues, early stages |

## 🗂️ Category Suggestions

1. **Nutrition Deficiencies** (Order: 1)
   - Nitrogen, Phosphorus, Potassium
   - Micronutrients (Zinc, Iron, etc.)

2. **Insect Damage** (Order: 2)
   - Stem borers, Leaf folders
   - Plant hoppers, Aphids

3. **Fungal Diseases** (Order: 3)
   - Rice Blast, Brown Spot
   - Sheath Blight, False Smut

4. **Bacterial Diseases** (Order: 4)
   - Bacterial Leaf Blight
   - Bacterial Leaf Streak

5. **Viral Diseases** (Order: 5)
   - Rice Tungro
   - Rice Grassy Stunt

6. **Environmental Stress** (Order: 6)
   - Heat/Cold damage
   - Salinity, Drought

## 🔐 Access Control

### Grant Studio Access
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to "Members"
4. Click "Invite members"
5. Enter email and select role
6. Send invitation

### Roles
- **Administrator**: Full access
- **Editor**: Can edit content
- **Viewer**: Read-only access

## 📱 Deployment

### Deploy Sanity Studio
```bash
cd sanity
npm run build
sanity deploy
# Choose hostname: your-studio-name
# Access at: https://your-studio-name.sanity.studio
```

### Deploy Frontend
```bash
cd frontend
# Add environment variables in hosting platform
# Deploy as usual (Vercel, Netlify, etc.)
```

## 🔗 Useful Links

- **Sanity Dashboard**: https://sanity.io/manage
- **Documentation**: https://sanity.io/docs
- **GROQ Cheat Sheet**: https://sanity.io/docs/query-cheat-sheet
- **Community Slack**: https://slack.sanity.io

## 📞 Getting Help

1. Check `SANITY_INTEGRATION.md` for quick start
2. See `SANITY_SETUP.md` for detailed setup
3. Review `SANITY_ARCHITECTURE.md` for system design
4. Check browser console for errors
5. Review Sanity logs in dashboard
6. Ask in project repository issues

## ⚡ Pro Tips

1. **Use descriptive names**: Make diseases easy to find
2. **Add alt text**: Improves accessibility and SEO
3. **Set proper order**: Control display sequence
4. **Use high-quality images**: Better for identification
5. **Fill expert notes**: Provide additional context
6. **Test before publishing**: Preview in Studio
7. **Keep categories organized**: Don't create too many
8. **Regular backups**: Export dataset periodically

## 🎯 Best Practices

### Content
- ✅ Use clear, concise language
- ✅ Include scientific names
- ✅ Provide step-by-step treatment
- ✅ Add multiple reference images
- ✅ Update seasonality information
- ✅ Include economic impact data

### Images
- ✅ High resolution (min 800x600)
- ✅ Clear, well-lit photos
- ✅ Show disease symptoms clearly
- ✅ Multiple angles/stages
- ✅ Add descriptive alt text
- ✅ Optimize file size (< 2MB)

### Organization
- ✅ Consistent naming convention
- ✅ Logical category grouping
- ✅ Proper ordering within categories
- ✅ Regular content reviews
- ✅ Archive outdated information
- ✅ Version control for major changes

---

**Print this card** for quick reference while working with Sanity! 📄

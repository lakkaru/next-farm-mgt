# Sanity Frontend Management Guide

## Overview

You can now manage all your Sanity documents (disease categories and disease information) directly from your Next.js frontend without needing to access Sanity Studio separately!

## 🚀 Quick Start

### 1. Get Your Sanity API Token

To manage content, you need a Sanity API token with write permissions:

1. Go to [https://sanity.io/manage](https://sanity.io/manage)
2. Select your project: **Farm Management - Disease Database**
3. Navigate to **API** → **Tokens**
4. Click **Add API Token**
5. Give it a name (e.g., "Frontend Editor")
6. Select permissions: **Editor** (allows read and write)
7. Click **Add Token**
8. **Copy the token immediately** (you won't see it again!)

### 2. Access the Admin Interface

1. Navigate to: `/admin/sanity-manager` in your Next.js app
2. Paste your Sanity API token
3. Click **Save Token**
4. The token is saved securely in your browser's localStorage
5. Start managing your content!

## 📋 Features

### Disease Categories Management

**Create Category:**
- Click "Add Category" button
- Fill in:
  - Name (e.g., "Nutrition Deficiencies")
  - Slug (auto-generated from name)
  - Description (optional)
  - Icon (choose from dropdown)
  - Display Order (lower numbers appear first)
  - Active status (toggle visibility)
- Click "Create"

**Edit Category:**
- Click the edit icon on any category card
- Modify fields as needed
- Click "Update"

**Delete Category:**
- Click the trash icon on any category card
- Confirm deletion
- ⚠️ Warning: Ensure no diseases reference this category first!

### Disease Information Management

**Create Disease:**
- Click "Add Disease" button
- Fill in required fields:
  - Name *
  - Category *
  - Severity Level *
  - Description *
  - At least one Symptom *
  - At least one Treatment step *
- Fill in optional fields:
  - Scientific Name
  - Visual Signs
  - Causes
  - Prevention measures
  - Treatment Timing
  - Critical Growth Stages
  - Common Regions
  - Seasonality
  - Economic Impact
  - Expert Notes
  - Display Order
- Toggle active status
- Click "Create"

**Edit Disease:**
- Click the edit icon on any disease card
- Modify fields as needed
- Add/remove array items (symptoms, treatments, etc.)
- Click "Update"

**Delete Disease:**
- Click the trash icon on any disease card
- Confirm deletion

### Array Fields (Symptoms, Treatment, etc.)

For fields that accept multiple items:
- Click "Add [Field Name]" to add a new item
- Fill in the text input
- Click the trash icon to remove an item
- At least one item is required for Symptoms and Treatment

## 🔒 Security

### Token Storage
- Your Sanity token is stored in browser localStorage
- It's only accessible from your browser
- Click "Change Token" to update or remove it
- Never share your token with others

### Permissions
- The token requires "Editor" permissions
- This allows creating, updating, and deleting documents
- Use "Viewer" tokens for read-only access (not supported in this interface)

## 🎯 Best Practices

### Content Organization

1. **Create Categories First**
   - Set up all your disease categories before adding diseases
   - Use logical ordering (1, 2, 3, etc.)
   - Choose appropriate icons

2. **Consistent Naming**
   - Use clear, descriptive names
   - Include scientific names when available
   - Keep naming conventions consistent

3. **Complete Information**
   - Fill in as many fields as possible
   - Provide detailed symptoms and treatments
   - Add expert notes for additional context

4. **Proper Ordering**
   - Use the order field to control display sequence
   - Lower numbers appear first
   - Keep related items grouped

### Data Quality

1. **Symptoms**
   - Be specific and descriptive
   - List observable signs
   - Include timing information

2. **Treatment**
   - Provide step-by-step instructions
   - Include dosage/application rates
   - Mention safety precautions

3. **Prevention**
   - List proactive measures
   - Include best practices
   - Mention timing for preventive actions

## 🔄 Workflow

### Typical Content Creation Flow

1. **Set Up Categories**
   ```
   1. Nutrition Deficiencies (icon: Leaf)
   2. Insect Damage (icon: Bug)
   3. Fungal Diseases (icon: Droplets)
   4. Bacterial Diseases (icon: AlertCircle)
   5. Viral Diseases (icon: Shield)
   6. Environmental Stress (icon: Zap)
   ```

2. **Add Diseases to Each Category**
   - Start with high-severity diseases
   - Add complete information
   - Test visibility on the frontend

3. **Review and Refine**
   - Check the disease detection page
   - Verify all information displays correctly
   - Make adjustments as needed

## 🐛 Troubleshooting

### Token Issues

**"Sanity token required" error:**
- Ensure you've saved a valid token
- Check that the token has Editor permissions
- Try clearing localStorage and re-entering the token

**"Failed to create/update" error:**
- Verify your token hasn't expired
- Check that all required fields are filled
- Ensure you have proper permissions

### Data Not Showing

**Changes not appearing:**
- Refresh the page to see latest data
- Check that the document is marked as "Active"
- Verify the category is also active

**Images not uploading:**
- Image upload feature requires additional implementation
- For now, use Sanity Studio for image uploads
- Or implement the upload endpoint separately

## 📊 API Endpoints

The following API endpoints are available:

### Categories
- `GET /api/sanity/categories` - Fetch all categories
- `POST /api/sanity/categories` - Create category
- `PATCH /api/sanity/categories/[id]` - Update category
- `DELETE /api/sanity/categories/[id]` - Delete category

### Diseases
- `GET /api/sanity/diseases` - Fetch all diseases
- `POST /api/sanity/diseases` - Create disease
- `PATCH /api/sanity/diseases/[id]` - Update disease
- `DELETE /api/sanity/diseases/[id]` - Delete disease

### Upload (Future)
- `POST /api/sanity/upload` - Upload image

All write operations require the `x-sanity-token` header.

## 🎨 UI Features

### Visual Indicators
- **Severity Badges**: Red (high), Yellow (medium), Green (low)
- **Status Badges**: Active/Inactive
- **Category Icons**: Visual representation of each category

### Responsive Design
- Works on desktop and mobile
- Scrollable dialogs for long forms
- Grid layout for easy browsing

## 🔮 Future Enhancements

Potential improvements:
1. **Image Upload**: Direct image upload from frontend
2. **Bulk Operations**: Import/export multiple documents
3. **Search & Filter**: Find documents quickly
4. **Version History**: Track changes over time
5. **Rich Text Editor**: Better formatting for descriptions
6. **Image Gallery**: Manage additional images
7. **Validation**: Real-time field validation
8. **Auto-save**: Draft functionality

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify your Sanity token is valid
3. Ensure all required fields are filled
4. Try refreshing the page
5. Clear localStorage and re-enter token

## 🎓 Learning Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Client API](https://www.sanity.io/docs/js-client)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Happy Content Managing! 🌾**

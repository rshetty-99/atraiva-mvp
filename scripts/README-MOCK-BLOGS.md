# Mock Blog Posts Creation Script

This script creates 5 mock blog posts in Firestore with different categories for testing the category filtering and search functionality on the `/resources` page.

## Prerequisites

1. Firebase Admin SDK credentials configured in `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

2. Ensure you have the required images in `public/images/website/resources/`:
   - `blog-thumbnail-8.jpg`
   - `blog-thumbnail-5.jpg`
   - `blog-thumbnail-4.jpg`
   - `blog-thumbnail-2.jpg`
   - `blog-thumbnail-6.jpg`

## Blog Posts Created

The script creates 5 blog posts with the following categories:

1. **AI Security** - "AI-Powered Threat Detection: Revolutionizing Cybersecurity in 2025"
2. **Ransomware** - "Ransomware Defense Strategies: Protecting Your Enterprise Network"
3. **Cloud Protection** - "Cloud Security Best Practices: Securing Multi-Cloud Environments"
4. **Incident Response** - "Incident Response Planning: A Comprehensive Guide for Security Teams"
5. **Zero Trust** - "Zero Trust Architecture: Implementation Strategies for Modern Organizations"

## Running the Script

```bash
npm run create-mock-blogs
```

Or using ts-node directly:

```bash
ts-node --project tsconfig.scripts.json scripts/create-mock-blog-posts.ts
```

## What the Script Does

1. **Creates blog posts** in Firestore `posts` collection with:
   - Title, slug, excerpt, and full HTML content
   - Category and tags for filtering
   - Author ID for `rajesh@atraiva.ai`
   - Published status
   - SEO metadata
   - View and like counts (randomized for realism)

2. **Uploads images** to Firebase Storage (optional):
   - Images are uploaded to `blog/{slug}-{filename}.jpg`
   - If upload fails, falls back to local image paths
   - Images are made publicly accessible

3. **Calculates metrics**:
   - Word count and character count
   - Read time (based on 200 words/minute)

## Author Information

- **Email**: rajesh@atraiva.ai
- **Role**: Platform Admin
- **Author ID**: Generated as `user_rajesh_atraiva_ai` (or actual user ID if found)

## Testing

After running the script, you can test:

1. **Category Filtering**: Navigate to `/resources` and click different category buttons
2. **Search Functionality**: Use the search bar to find posts by title, content, or tags
3. **Tag Filtering**: Categories are derived from both `category` field and `tags` array

## Notes

- Posts are created with status "published" and are immediately visible
- Dates are staggered (1 day apart) for realistic timeline
- If Firebase Storage upload fails, local image paths are used (which work fine)
- The script can be run multiple times - it will create duplicate posts (you may want to clean up first)

## Troubleshooting

**Error: "Storage bucket not available"**
- Check that `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set correctly
- Verify Firebase Admin credentials are valid

**Error: "Firebase database is not initialized"**
- Ensure `.env.local` has all required Firebase configuration variables
- Check that Firebase Admin SDK credentials are properly formatted

**Images not uploading**
- This is non-critical - local image paths will be used as fallback
- Verify images exist in `public/images/website/resources/`


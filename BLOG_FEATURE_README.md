# Blog Management System - Implementation Guide

## Overview

A comprehensive blog management system has been created for Atraiva with full CRUD operations, rich text editing with Quill editor, Firebase Storage integration for images, and a beautiful front-end display on the resources page.

## Features Implemented

### ✅ Blog Templates System (NEW!)

- **6 Pre-Built Templates**: Breach Watch, Compliance Update, How-To Guide, Case Study, Product Announcement, Quick Tip
- **Auto-Opening Template Selector**: Appears when creating new posts
- **Manual Template Selection**: "Choose Template" button for switching templates
- **Smart Placeholders**: Pre-defined variables to replace (e.g., [COMPANY_NAME], [DATE])
- **Structured Content**: Professional layouts with headings, lists, checklists
- **Default Tags & Categories**: Auto-applied relevant metadata
- **Template Previews**: See sections and features before selecting
- **One-Click Apply**: Instant template loading with all formatting

### ✅ Admin Dashboard

- **Location**: `/admin/blog`
- Full CRUD operations (Create, Read, Update, Delete)
- Rich text editor with Quill
- Image upload with Firebase Storage integration
- Featured image support
- Tag management
- Category support
- SEO settings (title, description, keywords)
- Status management (draft, review, scheduled, published, archived)
- Search and filter functionality
- Responsive table view with post metrics
- **Template selector on create** (NEW!)

### ✅ Blog Editor

- **Component**: `RichTextEditor` (`src/components/blog/RichTextEditor.tsx`)
- Rich text formatting (headings, bold, italic, lists, etc.)
- Image upload directly in content
- Code blocks
- Blockquotes
- Links and embeds
- Automatic image upload to Firebase Storage

### ✅ Public Blog Display

- **Resources Page**: `/resources` - Shows all published blog posts in a grid
- **Blog Detail Page**: `/resources/[slug]` - Individual blog post view
- Beautiful card design with hover effects
- Pagination support
- Tag filtering
- Related posts based on tags
- Social sharing (Twitter, Facebook, LinkedIn, Copy Link)
- View counter and engagement metrics

## File Structure

```
src/
├── types/
│   └── blog.ts                          # TypeScript types and interfaces
│                                        # + BlogTemplate, TemplateSection, TemplatePlaceholder
├── lib/
│   ├── blog/
│   │   └── templates.ts                 # Blog template definitions (NEW!)
│   └── firebase/
│       └── storage.ts                   # Firebase Storage utilities
├── app/
│   ├── api/
│   │   └── blog/
│   │       ├── route.ts                 # GET (list) and POST (create)
│   │       ├── [id]/
│   │       │   └── route.ts             # GET, PUT, DELETE for individual posts
│   │       └── upload-image/
│   │           └── route.ts             # Image upload endpoint
│   ├── (dashboard)/
│   │   └── admin/
│   │       └── blog/
│   │           └── page.tsx             # Admin blog management page
│   └── (website)/
│       └── resources/
│           ├── page.tsx                 # Resources listing (updated)
│           └── [slug]/
│               └── page.tsx             # Individual blog post page
└── components/
    ├── blog/
    │   └── RichTextEditor.tsx          # Quill editor component
    └── website/
        └── resources/
            └── BlogGrid.tsx             # Blog grid component (updated)
```

## TypeScript Schema

The blog uses a comprehensive schema defined in `src/types/blog.ts`:

### Main Types

- **Post**: Main blog post type with all fields
- **PostStatus**: "draft" | "review" | "scheduled" | "published" | "archived"
- **PostContent**: Supports both HTML and block-based content
- **PostSEO**: SEO metadata (title, description, keywords)
- **Tag**: Tag information with post count
- **Comment**: Comment system (ready for future implementation)
- **Analytics**: View tracking and analytics

## Firebase Firestore Collection

### Collection Name: `posts`

### Document Structure

```javascript
{
  id: string,                    // Auto-generated
  title: string,
  slug: string,                  // URL-friendly identifier
  excerpt: string | null,
  content: {
    type: "html",
    html: string
  },
  featuredImage: string | null,  // Firebase Storage URL
  tags: string[],
  category: string | null,
  authorId: string,              // Clerk user ID
  status: PostStatus,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt: Timestamp | null,
  scheduledFor: Timestamp | null,

  // Metrics
  wordCount: number,
  charCount: number,
  readTimeMinutes: number,

  // SEO
  seo: {
    title: string,
    description: string,
    keywords: string[]
  },

  // Engagement
  views: number,
  likes: number,
  reactions: {},
  commentCount: number,

  // Settings
  language: string,
  feedIncluded: boolean,
  sitemapPriority: number
}
```

## API Endpoints

### 1. List Posts

**GET** `/api/blog`

Query Parameters:

- `status`: Filter by status (draft, published, etc.)
- `tag`: Filter by tag
- `category`: Filter by category
- `limit`: Number of posts to return (default: 10)
- `published`: Set to "true" for public posts only

Response:

```json
{
  "posts": [...],
  "total": 10
}
```

### 2. Create Post

**POST** `/api/blog`

Body:

```json
{
  "title": "Blog Post Title",
  "slug": "blog-post-title",
  "excerpt": "Brief description",
  "content": {
    "type": "html",
    "html": "<p>Content here</p>"
  },
  "featuredImage": "https://...",
  "tags": ["security", "compliance"],
  "category": "Security",
  "status": "draft",
  "seo": {
    "title": "SEO Title",
    "description": "SEO Description",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

Response:

```json
{
  "success": true,
  "postId": "abc123",
  "message": "Blog post created successfully"
}
```

### 3. Get Single Post

**GET** `/api/blog/[id]`

Response:

```json
{
  "post": {...}
}
```

### 4. Update Post

**PUT** `/api/blog/[id]`

Body: Same as create post

Response:

```json
{
  "success": true,
  "message": "Blog post updated successfully"
}
```

### 5. Delete Post

**DELETE** `/api/blog/[id]`

Response:

```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

### 6. Upload Image

**POST** `/api/blog/upload-image`

Body: FormData

- `file`: Image file (max 5MB)
- `postId`: Optional post ID for organization

Response:

```json
{
  "success": true,
  "url": "https://firebasestorage.googleapis.com/...",
  "path": "blog-images/..."
}
```

## Firebase Storage Structure

Images are stored in Firebase Storage with the following structure:

```
blog-images/
├── {postId}/
│   ├── image-timestamp-random.jpg
│   └── ...
└── image-timestamp-random.jpg (orphaned/draft images)
```

### Image Utilities

The `src/lib/firebase/storage.ts` file provides:

- `uploadImage(file, path)`: Upload image and get URL
- `uploadImageWithProgress(file, path, onProgress)`: Upload with progress tracking
- `deleteImage(url)`: Delete image by URL
- `generateImagePath(fileName, postId)`: Generate unique storage path
- `validateImage(file, maxSizeMB)`: Validate image before upload
- `extractImagesFromHtml(html)`: Extract image URLs from HTML
- `cleanupImages(oldUrls, newUrls)`: Clean up unused images

## Usage Guide

### For Admins

#### Creating a Blog Post with Templates (NEW!)

1. Navigate to `/admin/blog`
2. Click "Create Blog Post"
3. **Template Selector Dialog Appears**:
   - Choose from 6 pre-built templates:
     - 🚨 **Breach Watch** - For regulatory breach notifications
     - 📋 **Compliance Update** - For new regulations and law changes
     - 📚 **How-To Guide** - For step-by-step tutorials
     - 💼 **Case Study** - For customer success stories
     - 🚀 **Product Announcement** - For new features
     - 💡 **Quick Tip** - For short, actionable advice
   - Or select "Start from Scratch" for a blank post
4. **Template Loads Automatically** with:
   - Pre-written structure with placeholders
   - Default tags and category
   - Professional formatting
5. **Replace Placeholders** like [COMPANY_NAME], [DATE], etc.
6. Customize content as needed
7. Add featured image
8. Publish!

**Pro Tip**: Click "Choose Template" button in the header anytime to switch templates.

#### Creating a Blog Post (Manual Method)

1. Navigate to `/admin/blog`
2. Click "Create Blog Post"
3. Click "Start from Scratch" in template dialog
4. Fill in the form:
   - **Title**: Main post title
   - **Slug**: URL-friendly identifier (auto-generated from title if empty)
   - **Excerpt**: Brief description for cards and SEO
   - **Featured Image**: Upload a cover image
   - **Tags**: Add relevant tags (press Enter to add)
   - **Category**: Optional category
   - **Status**: Choose status (draft, published, etc.)
   - **SEO Settings**: Customize SEO metadata
   - **Content**: Use the rich text editor to write your post
5. Click "Create Post"

#### Uploading Images in Content

1. In the rich text editor, click the image icon in the toolbar
2. Select an image file (max 5MB)
3. The image will be automatically uploaded to Firebase Storage
4. The image will be inserted into your content

#### Managing Posts

- **View**: See all posts in a table with metrics
- **Search**: Filter by title, excerpt, or tags
- **Filter**: Filter by status (all, draft, published, archived)
- **Edit**: Click the menu icon → Edit
- **Delete**: Click the menu icon → Delete (with confirmation)

### For Developers

#### Adding New Fields to Post Type

1. Update `src/types/blog.ts` with new fields
2. Update API routes to handle new fields:
   - `src/app/api/blog/route.ts` (POST)
   - `src/app/api/blog/[id]/route.ts` (PUT)
3. Update admin form in `src/app/(dashboard)/admin/blog/page.tsx`

#### Customizing the Editor

Edit `src/components/blog/RichTextEditor.tsx` to:

- Add/remove toolbar options
- Customize formatting
- Add custom handlers

#### Implementing View Counter

Create a new API endpoint:

```typescript
// src/app/api/blog/[id]/view/route.ts
export async function POST(request, { params }) {
  const { id } = params;
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, {
    views: increment(1),
  });
  return NextResponse.json({ success: true });
}
```

## Template Usage

### Available Templates

See [Blog Templates Guide](./BLOG_TEMPLATES_GUIDE.md) for complete documentation.

#### Quick Reference

| Template                | Best For                         | Key Features                                      |
| ----------------------- | -------------------------------- | ------------------------------------------------- |
| 🚨 Breach Watch         | Data breach news, AG settlements | Executive summary, timeline, compliance checklist |
| 📋 Compliance Update    | New regulations, law changes     | Summary, requirements, implementation timeline    |
| 📚 How-To Guide         | Step-by-step tutorials           | Prerequisites, steps, troubleshooting             |
| 💼 Case Study           | Customer success stories         | Challenge, solution, results, metrics             |
| 🚀 Product Announcement | New features, updates            | What's new, features, getting started             |
| 💡 Quick Tip            | Quick advice, best practices     | The tip, why it matters, how to implement         |

### Creating a Breach Watch Post

The **Breach Watch** template is perfect for posts like the NY AG press releases. See the [Breach Watch Quick Start Guide](./BREACH_WATCH_TEMPLATE_QUICK_START.md) for a complete walkthrough.

**Example workflow (10 minutes)**:

1. Find AG press release about data breach
2. Select Breach Watch template
3. Fill in executive summary (company, penalty, dates)
4. Copy incident details
5. List violations and takeaways
6. Add source link
7. Publish!

### Template Placeholders

Templates include smart placeholders you need to replace:

- `[COMPANY_NAME]` - Company involved
- `[PENALTY_AMOUNT]` - Fine amount
- `[DATE]` - Important dates
- `[INDUSTRY]` - Business sector
- `[SOURCE_URL]` - Link to original source

**Tip**: Use Find & Replace (Ctrl+H) to quickly replace all instances.

## Best Practices

### Template Best Practices

1. **Always Replace Placeholders**: Don't publish with [PLACEHOLDER] text
2. **Customize Don't Just Fill**: Add your expert commentary
3. **Maintain Structure**: Keep the logical flow of sections
4. **Add Value**: Include unique insights beyond the template
5. **Update Metadata**: Customize SEO fields after filling content
6. **Cite Sources**: Always link to original sources

### Image Optimization

1. **Compress images** before uploading (use tools like TinyPNG)
2. **Use appropriate formats**:
   - JPEG for photos
   - PNG for graphics with transparency
   - WebP for modern browsers
3. **Recommended sizes**:
   - Featured images: 1200x630px (Facebook OG size)
   - In-content images: Max 1200px width

### SEO Optimization

1. **Title**: 50-60 characters
2. **Description**: 150-160 characters
3. **Keywords**: 3-5 relevant keywords
4. **Slug**: Keep short, descriptive, hyphen-separated
5. **Featured Image**: Always include for social sharing

### Content Best Practices

1. **Use headings** (H2, H3) to structure content
2. **Add images** to break up text
3. **Include lists** for scanability
4. **Write compelling excerpts** (150-200 characters)
5. **Add relevant tags** (3-7 tags per post)
6. **Use code blocks** for technical content

### Performance

1. **Lazy load images** in blog grid (implemented with Next.js Image)
2. **Paginate** blog listings (implemented)
3. **Cache API responses** (consider adding React Query)
4. **Optimize Firestore queries** (use composite indexes if needed)

## Security Considerations

### Permissions

Currently, blog management is restricted to:

- `super_admin`
- `platform_admin`

To add more roles, update the permission check in:

```typescript
// src/app/(dashboard)/admin/blog/page.tsx
const role = session.currentOrganization?.role;
if (role !== "super_admin" && role !== "platform_admin") {
  // Handle unauthorized access
}
```

### Content Sanitization

The blog uses React's `dangerouslySetInnerHTML` for rendering HTML content. While Quill provides some sanitization, consider:

1. Adding a content security policy (CSP)
2. Using a library like DOMPurify for additional sanitization
3. Restricting HTML elements allowed in content

### Image Upload Security

Current validations:

- File type validation (JPEG, PNG, GIF, WebP)
- File size limit (5MB)
- Authenticated users only

Additional security measures to consider:

- Image content scanning for malicious code
- Virus scanning
- Rate limiting on uploads

## Future Enhancements

### Potential Features to Add

1. **Comments System**

   - Schema already defined in `blog.ts`
   - Needs UI and API implementation

2. **Author Management**

   - Multiple authors per post
   - Author profiles with bio and social links
   - Already have `UserAuthor` type defined

3. **Advanced Analytics**

   - Detailed view tracking
   - Reading progress
   - Engagement metrics
   - Integration with Google Analytics

4. **Newsletter Integration**

   - Auto-send new posts to subscribers
   - Integration with email service

5. **Post Scheduling**

   - Automated publishing at scheduled time
   - Needs cron job or scheduled function

6. **Content Versioning**

   - Track post history
   - Ability to restore previous versions

7. **Collaborative Editing**

   - Multiple editors
   - Draft approval workflow

8. **Media Library**

   - Browse and reuse uploaded images
   - Organized image management

9. **SEO Improvements**

   - Automatic sitemap generation
   - RSS feed
   - Schema.org markup

10. **Performance Optimizations**
    - Server-side rendering for blog posts
    - Static generation for better SEO
    - CDN integration for images

## Troubleshooting

### Images Not Uploading

1. Check Firebase Storage rules
2. Verify CORS settings
3. Check file size and format
4. Verify authentication

### Posts Not Appearing

1. Check post status (must be "published")
2. Verify Firestore security rules
3. Check API endpoint responses
4. Look for console errors

### Editor Not Loading

1. Check if `react-quill` is installed
2. Verify dynamic import is working
3. Check for console errors
4. Ensure styles are loaded

### Permission Errors

1. Verify user role in session
2. Check permission logic in admin page
3. Verify Clerk authentication

## Related Documentation

### Template System

- **[Blog Templates Guide](./BLOG_TEMPLATES_GUIDE.md)** - Complete template documentation
- **[Breach Watch Quick Start](./BREACH_WATCH_TEMPLATE_QUICK_START.md)** - Create breach posts in 10 minutes

### Feature Documentation

- **[Blog Quick Start](./BLOG_QUICK_START.md)** - Getting started guide
- **[Blog Verification Checklist](./BLOG_VERIFICATION_CHECKLIST.md)** - Testing checklist

## Dependencies

### Required Packages (Installed)

- `react-quill`: Rich text editor
- `quill-image-uploader`: Image upload handler
- `firebase`: Firebase SDK
- `@clerk/nextjs`: Authentication
- `next`: Next.js framework
- `framer-motion`: Animations

### Installation Command

```bash
npm install react-quill quill-image-uploader --legacy-peer-deps
```

Note: `--legacy-peer-deps` is used due to React 19 compatibility.

## Support

For issues or questions:

1. Check this README
2. Review console errors
3. Verify Firebase configuration
4. Check Clerk authentication setup

## Version History

### v1.0.0 - Initial Implementation

- Complete CRUD operations
- Rich text editor with Quill
- Firebase Storage integration
- Admin dashboard
- Public blog display
- SEO support
- Tag and category management
- Social sharing

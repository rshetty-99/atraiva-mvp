# Blog Feature - Quick Start Guide

## 🚀 Getting Started

The blog management system is now fully integrated into your Atraiva application. Here's how to start using it:

## 1. Access the Admin Panel

Navigate to: **`/admin/blog`**

This page is restricted to:

- Super Admins
- Platform Admins

## 2. Create Your First Blog Post

### Step-by-Step:

1. Click **"Create Blog Post"** button
2. Fill in the required fields:
   - **Title**: "Welcome to Our Blog"
   - **Slug**: Auto-generated (or customize)
   - **Excerpt**: Brief summary (for SEO and cards)
3. Upload a **Featured Image**
4. Add **Tags**: Type and press Enter
   - Example: "announcement", "welcome", "news"
5. Set **Category**: e.g., "Company News"
6. Choose **Status**: "published" to make it live
7. Write your content using the rich text editor
8. Click **"Create Post"**

### Rich Text Editor Features:

- **Headings**: H1-H6
- **Text Formatting**: Bold, Italic, Underline
- **Lists**: Ordered and Unordered
- **Images**: Click image icon to upload
- **Links**: Add hyperlinks
- **Code Blocks**: For technical content
- **Blockquotes**: For quotes
- **Colors**: Text and background colors

## 3. View Your Blog Post

### On Resources Page:

Navigate to: **`/resources`**

Your published blog post will appear in the blog grid at the bottom of the page.

### Individual Post View:

Click on any blog post card or navigate to:
**`/resources/your-post-slug`**

## 4. Managing Posts

### Edit a Post:

1. Go to `/admin/blog`
2. Find your post in the table
3. Click the three dots menu (⋮)
4. Click "Edit"
5. Make changes
6. Click "Update Post"

### Delete a Post:

1. Go to `/admin/blog`
2. Find your post
3. Click the three dots menu (⋮)
4. Click "Delete"
5. Confirm deletion

### Search and Filter:

- Use the search bar to find posts by title, excerpt, or tags
- Use status filter buttons: All, Draft, Published, Archived

## 5. Working with Images

### Featured Images:

- Recommended size: **1200x630px**
- Max file size: **5MB**
- Formats: JPEG, PNG, GIF, WebP

### Content Images:

1. In the editor, click the **image icon**
2. Select your image file
3. Wait for upload (shows loading toast)
4. Image appears in content

All images are automatically:

- Uploaded to Firebase Storage
- Optimized paths with unique names
- Stored in `blog-images/` folder

## 6. SEO Best Practices

### Optimize Your Posts:

1. **SEO Title**: 50-60 characters

   - Include main keyword
   - Make it compelling

2. **SEO Description**: 150-160 characters

   - Summarize the post
   - Include keywords naturally

3. **Keywords**: 3-5 relevant keywords

   - Separate by pressing Enter

4. **Slug**: Keep it short and descriptive

   - Example: "ai-security-guide"
   - Auto-generated from title

5. **Tags**: Use 3-7 relevant tags
   - Helps with categorization
   - Enables related posts

## 7. Blog Post Status Workflow

### Status Types:

1. **Draft**: Work in progress, not visible
2. **Review**: Ready for review (future workflow)
3. **Scheduled**: For future publishing (future feature)
4. **Published**: Live on the website
5. **Archived**: Hidden but not deleted

### Recommended Workflow:

1. Create post as **Draft**
2. Write and add images
3. Review content
4. Change to **Published** when ready

## 8. Viewing Blog Metrics

In the admin table, you can see:

- **Views**: How many times the post was viewed
- **Created Date**: When the post was created
- **Status**: Current publication status
- **Tags**: Associated tags
- **Category**: Post category

## 9. Social Sharing

Each blog post page includes share buttons for:

- **Twitter** (X)
- **Facebook**
- **LinkedIn**
- **Copy Link**

These are automatically functional on the post detail pages.

## 10. Related Posts

The system automatically shows related posts based on:

- Shared tags
- Same category

Up to 3 related posts appear at the bottom of each blog post.

## Common Tasks

### Change Post Status:

1. Edit the post
2. Change **Status** dropdown
3. Save

### Add Multiple Tags:

1. Type tag name
2. Press Enter
3. Repeat for each tag
4. Remove by clicking X on tag

### Upload Multiple Images in Content:

1. Click image icon
2. Upload first image
3. Click image icon again
4. Upload next image
5. Repeat as needed

### Create Featured Image:

- Use Canva or similar tools
- Export at 1200x630px
- Use clear, high-quality images
- Add text overlay if needed

## Troubleshooting

### Can't See Blog Page:

- Check your role (must be super_admin or platform_admin)
- Verify you're logged in
- Clear browser cache

### Image Upload Failed:

- Check image size (max 5MB)
- Verify format (JPEG, PNG, GIF, WebP)
- Check internet connection
- Try smaller image

### Post Not Showing on Resources Page:

- Verify status is "published"
- Refresh the page
- Check browser console for errors

### Editor Not Loading:

- Refresh the page
- Clear browser cache
- Check internet connection

## Tips for Great Blog Posts

### Content:

1. **Start with a hook**: Grab attention in first paragraph
2. **Use headings**: Break up content with H2 and H3
3. **Add images**: Every 300-400 words
4. **Include lists**: Makes content scannable
5. **End with CTA**: Call readers to action

### SEO:

1. **Keyword research**: Know what people search for
2. **Internal links**: Link to other pages on your site
3. **External links**: Link to authoritative sources
4. **Alt text**: Add descriptive alt text to images
5. **Meta description**: Write compelling descriptions

### Engagement:

1. **Write for your audience**: Know who you're talking to
2. **Be conversational**: Write like you talk
3. **Tell stories**: People remember stories
4. **Use examples**: Make concepts concrete
5. **Ask questions**: Engage readers

## Next Steps

1. ✅ Create your first blog post
2. ✅ Publish it and view on resources page
3. ✅ Share on social media
4. ✅ Create a content calendar
5. ✅ Publish regularly (1-2 posts per week recommended)

## Resources

- **Admin Panel**: `/admin/blog`
- **Resources Page**: `/resources`
- **Full Documentation**: See `BLOG_FEATURE_README.md`

## Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review the full documentation
3. Check browser console for errors
4. Verify Firebase and Clerk configuration

---

**Happy Blogging! 🎉**

Start creating amazing content for your audience today!

# Blog Post Approval Workflow Guide

## Overview

The blog system now includes a complete approval workflow that allows posts to be reviewed by admins before being published.

## Workflow States

### 1. **Draft** (Initial State)
- New posts are created with `draft` status
- Authors can edit and save drafts
- Drafts are not visible to the public

### 2. **Review** (Awaiting Approval)
- Posts are sent to review status when ready for admin approval
- Admins can see all posts in review
- Review posts are not visible to the public

### 3. **Published** (Approved)
- Admin approves and publishes the post
- Post becomes visible on the public website
- `publishedAt` timestamp is set

### 4. **Archived** (Optional)
- Published posts can be archived later
- Archived posts remain visible but can be filtered out

## How to Use the Approval Workflow

### For Authors/Creators:

#### Option 1: Save as Draft
1. Create or edit a blog post
2. Click **"Create Post"** or **"Update Post"** button
3. Post is saved with `draft` status
4. You can continue editing later

#### Option 2: Send for Review
1. Create or edit a blog post
2. Fill in all required fields (title, slug, content)
3. Click **"Send for Review"** button
4. Post status changes to `review`
5. Post appears in admin review queue

### For Admins:

#### Viewing Posts for Review
1. Navigate to `/admin/blog`
2. Click the **"Review"** filter button
3. All posts awaiting approval will be listed

#### Approving a Post

**Method 1: From Blog List Page**
1. Go to `/admin/blog`
2. Find the post in Draft or Review status
3. Click the **⋮** (three dots) menu on the post
4. Select **"Approve & Publish"**
5. Post status changes to `published`
6. Post becomes visible on the public website

**Method 2: From Edit Page**
1. Click **Edit** on the post
2. Change status dropdown to **"Published"**
3. Click **"Update Post"**
4. Post is published

#### Sending Back to Draft (Rejection)
1. Edit the post
2. Change status to **"Draft"**
3. Update the post
4. Author can make changes and resubmit

## UI Features

### Blog List Page (`/admin/blog`)

**Status Filters:**
- **All** - Shows all posts
- **Draft** - Shows only draft posts
- **Review** - Shows posts awaiting approval ✨ NEW
- **Published** - Shows published posts
- **Archived** - Shows archived posts

**Action Menu (⋮):**
For posts with `draft` or `review` status:
- ✅ **Approve & Publish** - Immediately publishes the post
- 📤 **Send for Review** - Only for draft posts (sends to review)
- ✏️ **Edit** - Edit the post
- 👁️ **View** - Preview the post
- 🗑️ **Delete** - Delete the post

For published posts:
- ✏️ **Edit** - Edit the post
- 👁️ **View** - View live post
- 🗑️ **Delete** - Delete the post

### Create/Edit Page (`/admin/blog/create`)

**Action Buttons:**
- **Send for Review** - Saves post and sets status to `review` (only visible for drafts)
- **Create Post** / **Update Post** - Saves with current status

**Status Dropdown:**
- Draft
- Review
- Scheduled
- Published
- Archived

## API Endpoints

### Update Post Status
**PUT** `/api/blog/[id]`

```json
{
  "status": "review",  // or "published", "draft", etc.
  "title": "...",
  "content": {...},
  // ... other fields
}
```

When status changes to `published`:
- `publishedAt` timestamp is automatically set
- Post becomes visible on public website
- Post appears in `/resources` page

## Workflow Examples

### Example 1: New Post from URL Converter

1. **Convert URL** → `/admin/blog/create?url=https://example.com/article`
2. **Review extracted content** → Edit title, slug, content as needed
3. **Send for Review** → Click "Send for Review" button
4. **Admin Approval** → Admin sees post in Review filter, clicks "Approve & Publish"
5. **Published** → Post is live on `/resources/[slug]`

### Example 2: Manual Post Creation

1. **Create Post** → Click "Create New" → Select template
2. **Fill Content** → Add title, content, tags, etc.
3. **Save as Draft** → Click "Create Post" (saves as draft)
4. **Edit Later** → Make additional changes
5. **Send for Review** → Click "Send for Review"
6. **Admin Reviews** → Admin reviews content
7. **Approve** → Admin clicks "Approve & Publish"
8. **Live** → Post is published

### Example 3: Revision Request

1. **Post in Review** → Admin reviews post
2. **Needs Changes** → Admin edits post, changes status back to "Draft"
3. **Author Edits** → Author sees post in Draft, makes requested changes
4. **Resubmit** → Author clicks "Send for Review" again
5. **Approved** → Admin approves on second review

## Status Badge Colors

- **Draft** - Gray (secondary)
- **Review** - Blue (default) - Indicates awaiting action
- **Published** - Blue (default)
- **Archived** - Outlined (outline)

## Permissions

Only users with the following roles can approve posts:
- `super_admin`
- `platform_admin`

These roles have access to:
- Blog management page (`/admin/blog`)
- Approve & Publish action
- All status filters

## Best Practices

1. **Use Review Status** - Always send posts for review before publishing
2. **Review Content** - Admins should review:
   - Content quality and accuracy
   - SEO metadata
   - Featured image
   - Tags and categories
   - Slug formatting

3. **Communication** - If changes are needed:
   - Change status back to Draft
   - Add comments/notes if needed (future enhancement)
   - Notify author (manual process for now)

4. **Bulk Actions** - Currently approval is one-by-one (bulk approve could be added in future)

## Future Enhancements

Potential improvements:
- [ ] Approval comments/notes from reviewers
- [ ] Email notifications when post is sent for review
- [ ] Email notifications when post is approved/rejected
- [ ] Bulk approve/reject actions
- [ ] Approval history/audit log
- [ ] Multiple reviewers/assignees
- [ ] Required fields checklist before sending to review
- [ ] Preview mode in review queue
- [ ] Version history for rejected posts

---

**Last Updated:** January 2025  
**Version:** 1.0


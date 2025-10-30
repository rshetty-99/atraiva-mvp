# Blog Feature - Verification Checklist

Use this checklist to verify that the blog feature is working correctly in your environment.

## 🔍 Pre-Verification Setup

### Environment Variables

- [ ] Firebase configuration variables are set in `.env.local`
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Firebase Setup

- [ ] Firestore database is created
- [ ] Storage bucket is enabled
- [ ] Security rules are configured (or using test mode)
- [ ] CORS is configured for Storage

### Dependencies

- [ ] Run `npm install` to ensure all packages are installed
- [ ] Verify `react-quill` and `quill-image-uploader` are in `package.json`

### Authentication

- [ ] Clerk is configured
- [ ] You have an admin account (super_admin or platform_admin role)
- [ ] You can log in successfully

---

## 📋 Verification Steps

### Part 1: Admin Panel Access

#### 1.1 Navigate to Admin Panel

- [ ] Start the dev server: `npm run dev`
- [ ] Log in to the application
- [ ] Navigate to `/admin/blog`
- [ ] Page loads without errors
- [ ] You see the blog management interface
- [ ] No permission errors appear

#### 1.2 Admin Interface Components

- [ ] "Create Blog Post" button is visible
- [ ] Search bar is present
- [ ] Status filter buttons are present (All, Draft, Published, Archived)
- [ ] Table headers are visible (Title, Status, Tags, Category, Created, Views, Actions)
- [ ] No console errors in browser developer tools

---

### Part 2: Create Blog Post

#### 2.1 Open Create Dialog

- [ ] Click "Create Blog Post" button
- [ ] Modal/dialog opens
- [ ] Form fields are visible:
  - [ ] Title input
  - [ ] Slug input
  - [ ] Excerpt textarea
  - [ ] Featured image upload
  - [ ] Tags input with add button
  - [ ] Category input
  - [ ] Status dropdown
  - [ ] SEO settings section (Title, Description)
  - [ ] Rich text editor

#### 2.2 Test Form Inputs

- [ ] Type in Title field
- [ ] Slug auto-generates or can be manually edited
- [ ] Excerpt accepts text
- [ ] Tags can be added by typing and pressing Enter
- [ ] Tags can be removed by clicking X
- [ ] Category input accepts text
- [ ] Status dropdown shows all options
- [ ] SEO fields accept text

#### 2.3 Test Featured Image Upload

- [ ] Click featured image upload input
- [ ] Select an image file (JPEG, PNG, or WebP)
- [ ] Loading state appears
- [ ] Success toast appears
- [ ] Image thumbnail shows next to upload button
- [ ] No errors in console

#### 2.4 Test Rich Text Editor

- [ ] Editor is visible and loaded
- [ ] Toolbar is present with formatting options
- [ ] Can type text in editor
- [ ] Can format text (bold, italic, etc.)
- [ ] Can add headings (H1, H2, H3)
- [ ] Can create lists (ordered and unordered)
- [ ] Can add blockquotes
- [ ] No "Quill not defined" or similar errors

#### 2.5 Test Image Upload in Editor

- [ ] Click image icon in editor toolbar
- [ ] File picker opens
- [ ] Select an image
- [ ] "Uploading image..." toast appears
- [ ] "Image uploaded successfully" toast appears
- [ ] Image appears in editor content
- [ ] Image is properly sized and visible

#### 2.6 Save Blog Post

- [ ] Fill in required fields (Title, Slug, Content)
- [ ] Set status to "published"
- [ ] Click "Create Post" button
- [ ] Success toast appears
- [ ] Dialog closes
- [ ] New post appears in the table
- [ ] No errors in console

---

### Part 3: Manage Blog Posts

#### 3.1 View Posts in Table

- [ ] Created post appears in the table
- [ ] Title is displayed correctly
- [ ] Status badge shows correct status
- [ ] Tags are displayed
- [ ] Category is displayed (or "-" if empty)
- [ ] Created date is formatted correctly
- [ ] Views count is displayed (0 for new post)
- [ ] Three-dot menu button is visible

#### 3.2 Search Functionality

- [ ] Type post title in search bar
- [ ] Table filters to show matching posts
- [ ] Clear search shows all posts again

#### 3.3 Filter Functionality

- [ ] Click "Draft" filter button
- [ ] Only draft posts are shown
- [ ] Click "Published" filter button
- [ ] Only published posts are shown
- [ ] Click "All" button
- [ ] All posts are shown again

#### 3.4 Edit Post

- [ ] Click three-dot menu on a post
- [ ] Click "Edit"
- [ ] Dialog opens with existing data
- [ ] All fields are populated correctly
- [ ] Make changes to content
- [ ] Click "Update Post"
- [ ] Success toast appears
- [ ] Changes are reflected in table
- [ ] No errors occur

#### 3.5 Delete Post (Optional)

- [ ] Click three-dot menu on a post
- [ ] Click "Delete"
- [ ] Confirmation dialog appears
- [ ] Click "Delete" to confirm
- [ ] Success toast appears
- [ ] Post is removed from table
- [ ] No errors occur

---

### Part 4: Public Display

#### 4.1 Resources Page

- [ ] Navigate to `/resources`
- [ ] Page loads successfully
- [ ] Scroll down to "Blog" section
- [ ] Published blog posts are displayed
- [ ] Blog cards show:
  - [ ] Featured image (or default)
  - [ ] Author avatar (generated from name)
  - [ ] Author name
  - [ ] Published date
  - [ ] Read time
  - [ ] Title
  - [ ] Excerpt
  - [ ] Tags
- [ ] Hover effects work on cards
- [ ] No console errors

#### 4.2 Pagination (if > 8 posts)

- [ ] Pagination controls are visible
- [ ] "Previous" and "Next" buttons work
- [ ] Page numbers are clickable
- [ ] Clicking page number shows correct posts
- [ ] Current page is highlighted

#### 4.3 Blog Post Detail Page

- [ ] Click on a blog post card
- [ ] Navigate to `/resources/[slug]`
- [ ] Page loads successfully
- [ ] Featured image is displayed (if set)
- [ ] Title is displayed
- [ ] Excerpt is displayed (if set)
- [ ] Meta info shows (date, read time, views, likes)
- [ ] Tags are displayed as badges
- [ ] Category badge is shown (if set)
- [ ] Blog content is rendered correctly
- [ ] Images in content are displayed
- [ ] Formatting is preserved (headings, lists, etc.)
- [ ] Code blocks are styled correctly (if any)
- [ ] Blockquotes are styled correctly (if any)
- [ ] "Back to Resources" button works
- [ ] No console errors

#### 4.4 Social Sharing

- [ ] Social share buttons are visible (Twitter, Facebook, LinkedIn, Copy Link)
- [ ] Click Twitter button - opens share dialog
- [ ] Click Facebook button - opens share dialog
- [ ] Click LinkedIn button - opens share dialog
- [ ] Click Copy Link button - shows "Link copied" toast
- [ ] Copied link is correct URL

#### 4.5 Related Posts

- [ ] Related posts section appears (if there are related posts)
- [ ] Shows up to 3 related posts
- [ ] Related post cards display correctly
- [ ] Clicking related post navigates to that post
- [ ] No errors occur

#### 4.6 View Counter

- [ ] View count increments when visiting post
- [ ] Go back to `/admin/blog`
- [ ] View count has increased by 1
- [ ] No errors in console

---

### Part 5: Edge Cases & Error Handling

#### 5.1 Validation

- [ ] Try creating post without title - validation error shown
- [ ] Try creating post without slug - auto-generated from title
- [ ] Try creating post without content - validation error shown
- [ ] Try uploading file > 5MB - error message shown
- [ ] Try uploading non-image file - error message shown

#### 5.2 Empty States

- [ ] Navigate to `/resources` with no published posts
- [ ] "No blog posts available yet" message is shown
- [ ] No errors occur

#### 5.3 Not Found

- [ ] Navigate to `/resources/non-existent-slug`
- [ ] Redirects to `/resources`
- [ ] No errors occur (or 404 page is shown)

#### 5.4 Permissions

- [ ] Log out
- [ ] Try to access `/admin/blog` without login
- [ ] Redirected to login page
- [ ] Log in with non-admin account
- [ ] Try to access `/admin/blog`
- [ ] Permission error shown or redirected

---

## 🎯 Performance Checks

### Load Times

- [ ] Admin page loads in < 2 seconds
- [ ] Resources page loads in < 2 seconds
- [ ] Blog post page loads in < 2 seconds
- [ ] Images load progressively (not all at once)

### Responsiveness

- [ ] Test on mobile viewport (< 768px)
  - [ ] Admin table is scrollable
  - [ ] Forms are usable
  - [ ] Blog cards stack vertically
  - [ ] Blog post content is readable
- [ ] Test on tablet viewport (768px - 1024px)
  - [ ] Layout adjusts appropriately
  - [ ] Images are properly sized
- [ ] Test on desktop viewport (> 1024px)
  - [ ] All features work correctly
  - [ ] Layout is optimal

### Browser Compatibility

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if on Mac)
- [ ] Test in Edge

---

## 🐛 Common Issues & Solutions

### Issue: "Quill is not defined"

**Solution**:

- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`
- Hard refresh browser (Ctrl+Shift+R)

### Issue: Images not uploading

**Solution**:

- Check Firebase Storage rules
- Verify CORS configuration
- Check browser console for specific errors
- Verify environment variables

### Issue: Posts not showing on resources page

**Solution**:

- Ensure post status is "published"
- Check API endpoint: `/api/blog?published=true`
- Check browser console for errors
- Verify Firestore security rules

### Issue: Permission denied on admin page

**Solution**:

- Verify user role is "super_admin" or "platform_admin"
- Check session data in browser console
- Verify Clerk configuration

### Issue: Rich text editor not loading

**Solution**:

- Check if react-quill is installed: `npm list react-quill`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for JavaScript errors in console

---

## ✅ Final Verification

### All Systems Go Checklist

- [ ] Admin panel is accessible
- [ ] Can create blog posts
- [ ] Can upload images (featured and inline)
- [ ] Can edit existing posts
- [ ] Can delete posts (with confirmation)
- [ ] Posts appear on resources page
- [ ] Individual post pages work
- [ ] Social sharing works
- [ ] View counter works
- [ ] Search and filters work
- [ ] Pagination works (if applicable)
- [ ] No console errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Performance is acceptable

---

## 📸 Screenshot Checklist (Optional)

For documentation or testing purposes, take screenshots of:

- [ ] Admin blog list page
- [ ] Create/Edit blog post dialog
- [ ] Rich text editor with content
- [ ] Resources page with blog cards
- [ ] Individual blog post page
- [ ] Mobile view of blog post
- [ ] Social sharing buttons

---

## 🎉 Completion

If all items are checked, congratulations! Your blog feature is fully functional and ready for use.

### Next Steps

1. Start creating content
2. Publish your first blog post
3. Share on social media
4. Monitor analytics (views, engagement)
5. Iterate and improve based on user feedback

---

## 📝 Notes Section

Use this space to note any issues or observations:

```
Date: __________
Tester: __________

Issues Found:
-
-
-

Additional Notes:
-
-
-
```

---

**Verification completed on**: ******\_\_\_\_******

**Verified by**: ******\_\_\_\_******

**Status**: ⬜ All Tests Passed | ⬜ Issues Found (see notes)

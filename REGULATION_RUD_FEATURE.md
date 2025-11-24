# Regulation RUD (Read, Update, Delete) Feature

## Overview

The Regulation Detail page at `/admin/reference/state-regulations/[id]` has been converted from a read-only view to a full RUD (Read, Update, Delete) interface. This allows platform administrators to view, edit, and delete regulation records directly from the detail page.

## Features

### Read (View Mode)
- **Comprehensive Display**: Shows all regulation details organized in sections
- **Clean Layout**: Card-based design with clear sections
- **Quick Actions**: View source link and edit/delete buttons
- **Formatted Display**: Proper formatting for dates, currencies, and booleans

### Update (Edit Mode)
- **Inline Editing**: Edit all fields directly on the same page
- **Form Validation**: Client-side validation for required fields
- **Section Organization**: Fields grouped by category (Basic Info, Breach Notification, Requirements, Penalties, References)
- **Edit/Cancel**: Toggle between view and edit modes
- **Auto-save**: Saves changes via API with loading indicators
- **Toast Notifications**: Success/error feedback

### Delete
- **Confirmation Dialog**: Prevents accidental deletions
- **Permission Check**: Only platform admins can delete
- **Auto-redirect**: Returns to regulations list after successful deletion
- **Loading State**: Shows spinner during deletion

## File Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   └── admin/
│   │       └── reference/
│   │           └── state-regulations/
│   │               ├── page.tsx                    # List page
│   │               └── [id]/
│   │                   └── page.tsx                # RUD page (updated)
│   └── api/
│       └── regulations/
│           └── [id]/
│               └── route.ts                        # API endpoints (new)
└── types/
    └── regulation.ts                               # Type definitions
```

## API Endpoints

### GET `/api/regulations/[id]`
Fetch a single regulation by ID.

**Authentication**: Required (Clerk)

**Response** (200 OK):
```json
{
  "regulation": {
    "id": "regulation_id",
    "regulationName": "California Data Breach Notification Law",
    "jurisdictionType": "state",
    "jurisdictionName": "California",
    "state": "CA",
    "status": "active",
    // ... other fields
  }
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Regulation doesn't exist
- `500 Internal Server Error`: Server error

### PATCH `/api/regulations/[id]`
Update a regulation. Only platform admins (`super_admin`, `platform_admin`) can update.

**Authentication**: Required (Clerk)

**Authorization**: Platform Admin only

**Request Body**:
```json
{
  "regulationName": "Updated Name",
  "status": "active",
  "breachNotification": {
    "required": true,
    "timelineDays": 30
  },
  // ... other fields to update
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Regulation updated successfully",
  "regulation": {
    // ... updated regulation object
  }
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't have platform admin permissions
- `400 Bad Request`: No fields provided for update
- `500 Internal Server Error`: Server error

### DELETE `/api/regulations/[id]`
Delete a regulation. Only platform admins can delete.

**Authentication**: Required (Clerk)

**Authorization**: Platform Admin only

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Regulation deleted successfully",
  "id": "regulation_id"
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't have platform admin permissions
- `404 Not Found`: Regulation doesn't exist
- `500 Internal Server Error`: Server error

## UI Components

### View Mode

**Header Section**:
- Back button
- Regulation name
- Status badge
- Action buttons: "View Source", "Edit", "Delete"

**Content Sections**:
1. **Basic Information**
   - Regulation name, state, jurisdiction type, jurisdiction name
   - Regulation type, industry, status, effective date
   - Scope description

2. **Breach Notification**
   - Required checkbox
   - Timeline (days/hours), threshold records
   - Notification requirements (AG, data subjects, CRAs)

3. **Requirements**
   - 11 checkboxes for various compliance requirements
   - Data inventory, risk assessment, security program, etc.

4. **Penalties**
   - Civil penalty per violation, max civil penalty
   - Criminal penalties, attorney fees, class action, private right of action

5. **References**
   - Statute number, reference URL

6. **Notes**
   - Additional comments or information

### Edit Mode

**Header Section**:
- Title changes to "Edit Regulation"
- Action buttons: "Cancel", "Save Changes"

**Form Fields**:
- All fields become editable
- Text inputs for strings
- Number inputs for numeric values
- Date pickers for dates
- Checkboxes for boolean flags
- Select dropdowns for enums
- Textareas for long text

**Save Behavior**:
- Click "Save Changes" → API call → Toast notification → Refresh data → Exit edit mode
- Click "Cancel" → Discard changes → Exit edit mode

### Delete Dialog

**Confirmation**:
- Modal dialog with warning message
- Shows regulation name in confirmation text
- "Cancel" and "Delete" buttons
- Delete button is red (destructive)
- Loading spinner during deletion

## Permissions

### View
- ✅ All authenticated users can view regulations
- ✅ No role restrictions for read access

### Update
- ✅ Only `super_admin` and `platform_admin` roles
- ❌ Other roles cannot edit (button hidden or disabled)
- API enforces permission check

### Delete
- ✅ Only `super_admin` and `platform_admin` roles
- ❌ Other roles cannot delete (button hidden or disabled)
- API enforces permission check

## User Flow

### Viewing a Regulation
1. Navigate to `/admin/reference/state-regulations`
2. Click "View Details" on any regulation
3. See comprehensive regulation details
4. Click "View Source" to open external reference (if available)

### Editing a Regulation
1. On detail page, click "Edit" button
2. Page switches to edit mode
3. Update desired fields
4. Click "Save Changes"
5. See toast notification
6. Page refreshes with updated data
7. Automatically switches back to view mode

### Canceling Edits
1. In edit mode, click "Cancel"
2. All changes are discarded
3. Form resets to original values
4. Page switches back to view mode

### Deleting a Regulation
1. On detail page, click "Delete" button (red)
2. Confirmation dialog appears
3. Review warning message
4. Click "Delete" to confirm (or "Cancel" to abort)
5. See loading spinner
6. See toast notification
7. Automatically redirect to regulations list page

## Data Handling

### Form State Management
- Uses `formData` state to track current form values
- Initializes from fetched regulation data
- Updates on field changes
- Resets on cancel or successful save

### Nested Objects
The regulation model includes nested objects:
- `breachNotification`: Object with multiple properties
- `requirements`: Object with boolean flags
- `penalties`: Object with numeric and boolean values
- `references`: Object with URLs and statute info

Form handles nested updates correctly:
```typescript
setFormData({
  ...formData,
  breachNotification: {
    ...formData.breachNotification,
    required: checked,
  },
});
```

### Date Formatting
- Dates stored as ISO strings in Firestore
- Displayed as locale-formatted dates in view mode
- Date picker (type="date") in edit mode
- Converts between formats automatically

### Boolean Fields
- Displayed as checkboxes in both modes
- Disabled in view mode, enabled in edit mode
- Properly handles undefined/null values

## Error Handling

### Client-Side
- Form validation before submission
- Required fields marked with asterisk
- Empty state handling
- Loading states for async operations
- Toast notifications for feedback

### API-Level
- Permission checks
- Data validation
- Firestore error handling
- Detailed error messages
- Appropriate HTTP status codes

### Edge Cases
- Regulation not found → Error card with back button
- Network errors → Toast error with retry option
- Permission denied → 403 error toast
- Concurrent edits → Last write wins (Firestore behavior)

## Best Practices

### For Administrators

1. **Review Before Editing**
   - Carefully review current values before making changes
   - Use "Cancel" if unsure

2. **Verify Updates**
   - Check that changes are reflected after save
   - Review all sections for accuracy

3. **Backup Before Deletion**
   - Export JSON before deleting (use "Export JSON" button)
   - Deletion is permanent and cannot be undone

4. **Use Proper Values**
   - Enter dates in correct format
   - Use proper state codes (e.g., "CA", "NY")
   - Fill required fields (marked with *)

### For Developers

1. **API Consistency**
   - Always check permissions
   - Return consistent error formats
   - Log important actions

2. **State Management**
   - Keep form state in sync with server
   - Handle loading states
   - Provide clear feedback

3. **Validation**
   - Validate on both client and server
   - Handle edge cases
   - Provide helpful error messages

## Testing

### Update Flow
1. Navigate to regulation detail page
2. Click "Edit"
3. Modify several fields across different sections
4. Click "Save Changes"
5. Verify toast appears
6. Verify form exits edit mode
7. Verify changes are visible
8. Refresh page → Verify changes persist

### Cancel Flow
1. Click "Edit"
2. Modify several fields
3. Click "Cancel"
4. Verify form exits edit mode
5. Verify changes were discarded
6. Verify original values restored

### Delete Flow
1. Click "Delete"
2. Verify confirmation dialog appears
3. Click "Cancel" → Verify dialog closes, nothing deleted
4. Click "Delete" again
5. Click "Delete" in dialog
6. Verify loading spinner
7. Verify toast notification
8. Verify redirect to list page
9. Verify regulation no longer in list

### Permission Testing
1. Sign in as non-platform role (e.g., org_admin)
2. Navigate to regulation detail
3. Verify "Edit" and "Delete" buttons are visible but clicking shows permission error
4. Sign in as platform_admin
5. Verify full edit/delete functionality works

## Troubleshooting

### Common Issues

1. **Changes not saving**
   - Check browser console for errors
   - Verify network connectivity
   - Check Firestore rules allow write access
   - Verify user has platform admin role

2. **Delete not working**
   - Verify user is platform admin
   - Check Firestore rules
   - Check console for permission errors

3. **Form fields not updating**
   - Check React state management
   - Verify form field bindings
   - Check for console errors

4. **API errors**
   - Check Clerk authentication
   - Verify Firebase configuration
   - Check API route file is correctly placed
   - Review server logs

## Security Considerations

- ✅ Authentication required for all operations
- ✅ Role-based authorization for update/delete
- ✅ API-level permission enforcement
- ✅ Firestore security rules (recommended)
- ✅ Input validation on client and server
- ✅ Audit logging (updatedBy, updatedAt fields)

## Future Enhancements

### Phase 2 (Recommended)

1. **Version History**
   - Track all changes to regulations
   - Allow rollback to previous versions
   - Show diff between versions

2. **Bulk Operations**
   - Select multiple regulations
   - Bulk update common fields
   - Bulk delete with confirmation

3. **Advanced Validation**
   - Cross-field validation
   - Business rule checks
   - Warning for suspicious changes

4. **Approval Workflow**
   - Changes require approval
   - Review queue for platform admins
   - Change request system

5. **Import/Export**
   - Import from CSV/JSON
   - Export to multiple formats
   - Batch upload regulations

6. **Audit Log**
   - Dedicated audit log page
   - Filter by user, action, date
   - Export audit reports

---

**Created**: 2025-11-24  
**Last Updated**: 2025-11-24  
**Version**: 1.0


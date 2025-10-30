# Incident Reporting Feature

## Overview

The Incident Reporting feature provides a multi-step workflow for organizations to report and document security incidents. This feature follows the same pattern as the onboarding flow with 7 distinct steps.

## Feature Location

- **Route:** `/org/incident`
- **Components:** `src/components/incident/`
- **Mockups:** `public/mockups/report_incident*.html`

## Architecture

### Step-by-Step Flow

1. **Step 1: Incident Type**

   - Mockup: `report_incident.html`
   - Purpose: Select the type of security incident being reported

2. **Step 2: Incident Details**

   - Mockup: `report_incident_p2.html`
   - Purpose: Provide details about when and where the incident occurred

3. **Step 3: Affected Data**

   - Mockup: `report_incident_p3.html`
   - Purpose: Identify what data or systems were affected

4. **Step 4: Affected Individuals**

   - Mockup: `report_incident_p4.html`
   - Purpose: Specify who was impacted by the incident

5. **Step 5: Incident Timeline**

   - Mockup: `report_incident_p5.html`
   - Purpose: Document the timeline of events

6. **Step 6: Response Actions**

   - Mockup: `report_incident_p6.html`
   - Purpose: Document actions taken in response to the incident

7. **Step 7: Review & Submit**
   - Mockup: `report_incident_p7.html`
   - Purpose: Review the complete incident report and submit

## Technical Implementation

### Components Structure

```
src/components/incident/
├── index.ts              # Barrel export file
├── Step1.tsx             # Incident Type
├── Step2.tsx             # Incident Details
├── Step3.tsx             # Affected Data
├── Step4.tsx             # Affected Individuals
├── Step5.tsx             # Incident Timeline
├── Step6.tsx             # Response Actions
└── Step7.tsx             # Review & Submit
```

### Main Page

- **File:** `src/app/(dashboard)/org/incident/page.tsx`
- **Features:**
  - Progress tracking with visual indicators
  - Smooth animations between steps using Framer Motion
  - Navigation buttons (Previous/Next)
  - Step completion badges
  - Loading states during transitions

### Form Features

Each step component includes:

1. **Form Validation** - Real-time validation with error messages
2. **Auto-save** - Save button stores data to localStorage
3. **Progress Persistence** - Data persists across page reloads
4. **Smooth Animations** - Framer Motion page transitions
5. **Responsive Design** - Mobile-friendly layouts
6. **Accessibility** - ARIA labels and keyboard navigation

## Features

### Progress Tracking

- Visual progress bar showing completion percentage
- Step counter (e.g., "Step 3 of 7")
- Step indicator dots at the bottom of the page

### Navigation

- **Next Button:** Advances to the next step
- **Previous Button:** Returns to the previous step
- **Complete Report Button:** Final step redirects to incidents list

### User Experience

- Smooth fade transitions between steps
- Loading spinner during step transitions
- Card-based layout with gradient accents
- Responsive design that works on all screen sizes

### Icons

Each step has a unique icon representing its purpose:

- 🚨 Alert Triangle (Incident Type)
- 📄 File Text (Incident Details)
- 🛡️ Shield (Affected Data & Response Actions)
- 👥 Users (Affected Individuals)
- ⏰ Clock (Incident Timeline)
- ✅ Check Circle (Review & Submit)

## Navigation Flow

```
Home → Dashboard → Org Menu → Report Incident
                                      ↓
                            Step 1: Incident Type
                                      ↓
                          Step 2: Incident Details
                                      ↓
                           Step 3: Affected Data
                                      ↓
                       Step 4: Affected Individuals
                                      ↓
                         Step 5: Incident Timeline
                                      ↓
                        Step 6: Response Actions
                                      ↓
                        Step 7: Review & Submit
                                      ↓
                            Complete & Redirect
                                      ↓
                             Incidents List
```

## Styling

### Theme Colors

- **Primary Gradient:** Red to Orange (`from-red-600 to-orange-600`)
- **Background:** Gradient from background to muted
- **Cards:** Glass-morphism effect with backdrop blur
- **Progress Bar:** Primary color with smooth animation

### Responsive Design

- Maximum width container: `max-w-7xl`
- Padding: Consistent 8px spacing
- Mobile-friendly navigation
- Touch-optimized buttons

## Future Enhancements

### Phase 2 (Backend Integration)

- [ ] Replace iframes with actual React forms
- [ ] Add form validation for each step
- [ ] Implement data persistence between steps
- [ ] Add API integration for incident submission
- [ ] Create Firestore collections for incidents
- [ ] Add file upload capability for evidence
- [ ] Implement auto-save functionality

### Phase 3 (Advanced Features)

- [ ] Email notifications to stakeholders
- [ ] Incident severity classification
- [ ] Automated compliance report generation
- [ ] Integration with external incident response tools
- [ ] Real-time collaboration features
- [ ] Mobile app support

## Testing

### Manual Testing Checklist

- [ ] Navigate through all 7 steps
- [ ] Test Previous/Next buttons at each step
- [ ] Verify mockup displays correctly in iframe
- [ ] Check progress bar updates correctly
- [ ] Verify step indicators show current position
- [ ] Test on different screen sizes
- [ ] Verify animations work smoothly
- [ ] Test final "Complete Report" button

### Access Testing

To test the feature:

1. Log in as an org admin
2. Navigate to `/org/incident`
3. Progress through all 7 steps
4. Verify completion flow

## Dependencies

- **framer-motion:** For smooth animations
- **lucide-react:** For icons
- **shadcn/ui:** For UI components (Card, Button, Progress, Badge, Form, Input, Textarea, Select, Checkbox, Radio, Alert)
- **next/navigation:** For routing
- **react-hook-form:** For form state management
- **zod:** For schema validation
- **@hookform/resolvers:** For integrating Zod with React Hook Form
- **@radix-ui/react-radio-group:** For radio button components
- **react-datepicker:** For date/time selection
- **react-phone-number-input:** For phone number input

## Notes

- All mockup HTML files are self-contained with inline styles
- No external dependencies required for mockups
- Mockups are responsive and work in iframe context
- Height calculation ensures proper display across devices

## Related Documentation

- [Onboarding Flow](./src/app/onboarding/README.md) - Similar implementation pattern
- [Dashboard Architecture](./DASHBOARD_ARCHITECTURE.md) - Overall dashboard structure
- [PRD: Breach Notification](./documentation/breachnotifcation.prd) - Feature requirements

## Support

For questions or issues with the Incident Reporting feature:

- Check the component files in `src/components/incident/`
- Review the main page at `src/app/(dashboard)/org/incident/page.tsx`
- Verify mockup files are present in `public/mockups/`

---

**Created:** October 12, 2025  
**Status:** ✅ Implementation Complete  
**Version:** 1.0.0

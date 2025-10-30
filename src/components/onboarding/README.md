# Atraiva Onboarding Components

This directory contains the complete onboarding flow components for the Atraiva compliance platform, implementing the User Management and RBAC PRD requirements.

## Overview

The onboarding system provides a comprehensive, multi-step experience that guides users through:

1. **Welcome & Introduction** - Platform overview and value proposition
2. **Role Selection** - Choose user type and specific role
3. **Organization Setup** - Configure organization details and preferences
4. **Dashboard Preview** - Preview personalized dashboard based on role
5. **Security Setup** - Configure MFA and security preferences
6. **Completion** - Final setup and next steps

## Components

### Main Onboarding Page

- **File**: `src/app/onboarding/page.tsx`
- **Purpose**: Main onboarding flow controller with step management
- **Features**: Progress tracking, step navigation, data persistence

### Step Components

#### 1. WelcomeStep (`WelcomeStep.tsx`)

- **Purpose**: Introduction to Atraiva platform
- **Features**:
  - Platform value proposition
  - Feature highlights with icons
  - Statistics and metrics
  - Call-to-action to begin setup

#### 2. RoleSelectionStep (`RoleSelectionStep.tsx`)

- **Purpose**: User type and role selection
- **Features**:
  - Four user types: Law Firm, Enterprise, Channel Partner, Platform Admin
  - Role-specific features and descriptions
  - Visual role cards with icons
  - Dynamic role selection based on user type

#### 3. OrganizationSetupStep (`OrganizationSetupStep.tsx`)

- **Purpose**: Organization configuration
- **Features**:
  - Multi-step form with progress indicator
  - Basic information (name, type, industry, team size)
  - Contact details (website, phone, address)
  - Additional details (description)
  - Form validation with CustomFormField components

#### 4. DashboardPreviewStep (`DashboardPreviewStep.tsx`)

- **Purpose**: Dashboard preview and layout selection
- **Features**:
  - Role-based dashboard templates
  - Interactive widget previews
  - Layout selection (sidebar, top-nav, hybrid)
  - Mock data visualization
  - Feature highlights

#### 5. SecuritySetupStep (`SecuritySetupStep.tsx`)

- **Purpose**: Security configuration
- **Features**:
  - MFA method selection (TOTP, SMS, Email, Hardware Key)
  - Interactive MFA setup flow
  - Security preferences (session timeout, password policy)
  - Notification settings
  - Security summary

#### 6. CompletionStep (`CompletionStep.tsx`)

- **Purpose**: Setup completion and next steps
- **Features**:
  - Animated setup progress
  - Account summary
  - Next steps recommendations
  - Quick actions
  - Support information

## Design System Integration

### UI Components Used

- **shadcn/ui**: Card, Button, Input, Label, Select, Textarea, Badge, Progress, Tabs, Switch
- **CustomFormField**: All forms use the mandatory CustomFormField component
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Consistent iconography

### Design Principles

- **Mobile-First**: Responsive design starting from 320px
- **Accessibility**: WCAG 2.1 AA compliance
- **Healthcare Focus**: HIPAA-compliant design patterns
- **Consistent Branding**: Atraiva color scheme and typography

## User Types & Roles

### Law Firm

- **Law Firm Admin**: Complete firm management and client oversight
- **Law Firm Manager**: Operational management and client coordination
- **Law Firm Analyst**: Data analysis and evidence management

### Enterprise

- **Enterprise Admin**: Complete organization control and management
- **Enterprise Manager**: Department oversight and incident management
- **Enterprise Viewer**: Read-only access to compliance status

### Channel Partner

- **Channel Partner Admin**: Partner management and client oversight

### Platform Administrator

- **Super Admin**: Complete platform control and oversight
- **Platform Admin**: Platform operations and support management

## Dashboard Templates

Each role has a customized dashboard template with:

- **Layout Options**: Sidebar, top navigation, hybrid
- **Widget Types**: Charts, metrics, lists, tables, custom components
- **Role-Specific Features**: Appropriate data and functionality
- **Responsive Design**: Mobile-optimized layouts

## Security Features

### Multi-Factor Authentication

- **TOTP**: Google Authenticator, Authy, 1Password
- **SMS**: Phone number verification
- **Email**: Email code verification
- **Hardware Keys**: YubiKey and similar devices

### Security Policies

- **Session Management**: Configurable timeout (15min - 8hrs)
- **Password Policies**: Standard, Strong, Enterprise levels
- **Notifications**: Email and SMS security alerts
- **Compliance**: HIPAA-compliant security measures

## Data Flow

```typescript
interface OnboardingData {
  userType: "law_firm" | "enterprise" | "channel_partner" | "platform_admin";
  role: string;
  organizationName: string;
  organizationType: string;
  teamSize: string;
  mfaEnabled: boolean;
  preferences: {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    dashboardLayout: string;
  };
}
```

## Testing

### Test Page

- **File**: `src/app/onboarding/test/page.tsx`
- **Purpose**: Component testing and development
- **Features**: Step navigation, data display, isolated testing

### Test Data

The test page includes mock data for all user types and roles to verify:

- Component rendering
- Data flow
- Form validation
- Step transitions

## Usage

### Basic Implementation

```tsx
import OnboardingPage from "@/app/onboarding/page";

export default function App() {
  return <OnboardingPage />;
}
```

### Custom Integration

```tsx
import { OnboardingData } from "@/app/onboarding/page";

const handleOnboardingComplete = (data: OnboardingData) => {
  // Process onboarding data
  console.log("Onboarding completed:", data);
};
```

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG 2.1 AA compliant color ratios
- **Touch Targets**: Minimum 44x44px touch targets
- **Focus Management**: Clear focus indicators and logical tab order

## Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Animation Performance**: Hardware-accelerated animations
- **Bundle Size**: Optimized imports and tree shaking
- **Image Optimization**: WebP images with fallbacks

## Future Enhancements

- **A/B Testing**: Different onboarding flows
- **Personalization**: AI-driven step recommendations
- **Analytics**: User behavior tracking
- **Internationalization**: Multi-language support
- **White-labeling**: Partner-specific customization

## Dependencies

- **React 19.1.0**: Core framework
- **Next.js 15.4.7**: Full-stack framework
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library
- **Framer Motion**: Animation library
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Lucide React**: Icon library

## Contributing

When adding new onboarding steps or modifying existing ones:

1. Follow the established component pattern
2. Use CustomFormField for all forms
3. Maintain accessibility standards
4. Add proper TypeScript types
5. Include comprehensive error handling
6. Test across all user types and roles

## Support

For questions or issues with the onboarding system:

- Check the test page for component verification
- Review the PRD for requirements
- Consult the design system documentation
- Contact the development team

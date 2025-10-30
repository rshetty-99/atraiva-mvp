# UI Design Workflow

Create a comprehensive UI design workflow using the UI Designer and UI Auditor agents with Playwright MCP integration.

## Command Usage
```bash
/ui-design-workflow [design_requirements_or_mockup_path]
```

## Workflow Process

### Phase 1: Design Analysis & Planning
1. **Analyze Requirements**: Review design mockups, user stories, or requirements
2. **Extract Design Tokens**: Identify colors, typography, spacing, and component patterns
3. **Create Component Structure**: Plan the component hierarchy and reusable elements
4. **Define Responsive Strategy**: Plan mobile-first breakpoints and layouts

### Phase 2: Implementation
1. **Assign to ui-designer**: Delegate implementation to the UI Designer agent
2. **Follow Project Standards**: 
   - Use Shadcn forms
   - Use CustomFormField components for all forms
   - Implement shadcn/ui components
   - Apply Tailwind CSS utilities and add a break for very large screens
   - Add TypeScript types
   - Don't use any type while scripting
   - Include Framer Motion animations
3. **Create Base Layout**: Start with mobile-first responsive structure
4. **Add Interactive Elements**: Buttons, forms, navigation, and feedback states

### Phase 3: Visual Verification
1. **Take Screenshots**: Use Playwright MCP to capture current implementation
2. **Compare with Mockup**: Visual diff against original design specifications
3. **Document Discrepancies**: List any differences or issues found
4. **Iterate if Needed**: Make adjustments based on visual comparison

### Phase 4: Quality Audit
1. **Assign to ui-auditor**: Delegate comprehensive review to UI Auditor agent
2. **Accessibility Audit**: WCAG 2.1 AA compliance verification
3. **Responsive Testing**: Test across all breakpoints (mobile, tablet, desktop)
4. **Cross-Browser Verification**: Ensure compatibility across major browsers
5. **Performance Analysis**: Check bundle size and loading performance

### Phase 5: Iteration & Refinement
1. **Review Audit Report**: Analyze findings from ui-auditor
2. **Prioritize Issues**: Critical > Accessibility > Design > Performance
3. **Implement Fixes**: Address issues systematically
4. **Re-audit if Necessary**: Repeat audit cycle until quality standards met
5. **Maximum 3 Iterations**: Limit revision cycles to maintain efficiency

### Phase 6: Final Validation & Delivery
1. **User Feedback Collection**: Present final implementation for review
2. **Implement Final Changes**: Address any user feedback
3. **Performance Optimization**: Final performance tuning
4. **Documentation**: Create component documentation and usage examples
5. **Stage Changes**: Prepare for deployment

## Quality Gates
- **95% Design Accuracy**: Visual implementation matches mockup
- **100% Accessibility Compliance**: WCAG 2.1 AA standards
- **Cross-Device Compatibility**: Perfect responsive behavior
- **90+ Performance Score**: Lighthouse performance metrics
- **User Approval**: Final sign-off from stakeholders

## Tools Integration
- **Playwright MCP**: Visual testing, screenshots, accessibility scans
- **UI Designer Agent**: Implementation and coding
- **UI Auditor Agent**: Quality assurance and compliance
- **Framer Motion**: Smooth animations and transitions
- **shadcn/ui**: Consistent component library
- **CustomFormFields**: Standardized form components

## Expected Deliverables
1. Pixel-perfect responsive UI implementation
2. Comprehensive accessibility compliance
3. Performance-optimized code
4. Component documentation
5. Testing screenshots and reports
6. User-approved final design

This workflow ensures high-quality, accessible, and performant UI implementations that match design specifications while following project standards.
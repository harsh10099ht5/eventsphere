import pypandoc

design_md = r"""# EventSphere — UI/UX Design Specification

**Document status:** Working design specification  
**Last updated:** 29 October 2026  
**Product:** EventSphere  
**Related document:** `PRD.md`

> This document defines the intended visual design and interaction patterns based on the existing EventSphere interface shown in the project screenshots and the requirements discussed. Where exact existing implementation details are unknown, the guidance is marked as a design recommendation rather than a verified feature.

## 1. Design Direction

EventSphere should feel like a modern, clean, trustworthy campus-events platform. The design should emphasize event discovery and make event information easy to scan.

### Design principles
1. **Clarity first:** event title, date, category, venue, and primary action should be easy to identify.
2. **Consistent branding:** preserve the existing black, white, and red visual identity.
3. **Low-friction interactions:** login, signup, bookmarking, registration, and recommendations should have clear actions and feedback.
4. **Responsive by default:** layouts should work on desktop, tablet, and mobile.
5. **Honest system feedback:** do not show success states until the relevant API confirms success.
6. **Accessible controls:** labels, focus states, keyboard operation, and readable contrast are required.

## 2. Visual Identity

The current visible interface uses a white navigation bar, dark text, red emphasis in the EventSphere wordmark, and dark primary buttons.

### Recommended design tokens

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#FF4E55` | Brand accent, active states, links, small highlights |
| `--color-primary-hover` | `#E8434B` | Hover and pressed brand states |
| `--color-text` | `#171717` | Main text and headings |
| `--color-text-muted` | `#737373` | Supporting text |
| `--color-background` | `#FFFFFF` | Main page and cards |
| `--color-surface` | `#F7F7F6` | Soft page sections and subtle panels |
| `--color-border` | `#E5E5E5` | Dividers, input borders, card outlines |
| `--color-primary-action` | `#151515` | Main CTA buttons |
| `--color-success` | `#16803C` | Confirmed successful operations |
| `--color-error` | `#B4232F` | Errors and validation feedback |
| `--color-warning` | `#9A6700` | Warnings and caution states |

These values are suggested tokens based on the visible brand style; verify against `frontend/src/app.css` before treating them as the exact current CSS values.

### Typography
- Use the existing project font if already configured.
- Otherwise, use a clean sans-serif stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Use strong, compact headings and comfortable body line-height.
- Avoid introducing a new font dependency unless necessary.

### Shape, spacing, and elevation
- Use a consistent spacing scale based on 4 px: `4, 8, 12, 16, 24, 32, 48, 64`.
- Recommended card radius: 12–18 px.
- Recommended button/input radius: 9–12 px.
- Use subtle borders and restrained shadows. Avoid heavy shadows on every card.
- Maintain clear whitespace between page sections.

## 3. Global Layout

### Navigation
The current screenshot shows:
- EventSphere wordmark on the left.
- `Home`, `Events`, `How It Works`, and `About` links in the center.
- `Login` and `Get Started` actions on the right.

Recommended behavior:
- Keep the navigation height and alignment consistent across routes.
- Make the active section visually distinct.
- On smaller screens, collapse navigation into a keyboard-accessible menu.
- `Login` opens the login experience.
- `Get Started` opens the signup experience.
- Do not display a logged-in state until authentication is verified by the backend.

### Page container
- Use a centered content container with a readable maximum width.
- Keep consistent horizontal padding at desktop and mobile sizes.
- Avoid horizontal overflow at any viewport width.
- Ensure sticky/fixed elements do not cover page headings or dialogs.

## 4. Home Page

### Purpose
Explain what EventSphere does and direct users to discover events or get recommendations.

### Recommended hierarchy
1. Global navigation.
2. Hero section with a clear headline and supporting description.
3. Primary CTA such as `Explore Events`.
4. Secondary CTA such as `Get Started`.
5. Event highlights or upcoming-event preview.
6. `How It Works` explanation.
7. Benefits/features section.
8. About section and footer.

### Hero section
- Use a large, readable heading with limited line length.
- Highlight one key phrase in the brand red.
- Keep supporting text shorter than the headline.
- Ensure the primary CTA is visually dominant.
- If a hero illustration is used, it must not compete with the headline or CTAs.

### Home page states
- Loading: show a restrained skeleton or loading message for API-backed content.
- Empty: explain that no events are available yet and provide a useful next action.
- Error: show a concise message and retry action rather than a blank section.

## 5. Events Listing

### Purpose
Allow students to scan available events and identify relevant ones quickly.

### Event card information hierarchy
1. Category label.
2. Event title.
3. Short description.
4. Date and time.
5. Venue.
6. Skills or topic tags, when available.
7. Primary action: `View Details` or `Register`.
8. Secondary action: `Bookmark`.

### Layout
- Desktop: responsive multi-column grid, typically 3 columns where space permits.
- Tablet: 2 columns.
- Mobile: 1 column.
- Cards in a row should align consistently without clipping descriptions or actions.

### Interaction states
- Default, hover, keyboard focus, bookmarked, registration pending, registration success, and error.
- Disable duplicate submissions while a request is in progress.
- Show an accessible confirmation after an API-backed action succeeds.
- Do not treat a tracking event as a completed registration unless a proper registration record and confirmation exist.

### Search and filters
If supported by the current product:
- Provide a visible search field.
- Use category filters with clear selected states.
- Keep filters usable on mobile.
- Include a clear-filters action.
- Show an empty-results message when no events match.

## 6. Event Details

Recommended content:
- Event title and category.
- Date and time.
- Venue.
- Full description.
- Skills/topics.
- Bookmark action.
- Register action.
- Return-to-events navigation.

Do not show fields that are unavailable in the event record. Provide a clear not-found state for invalid event IDs.

## 7. AI Recommendations Page

### Purpose
Explain why events are recommended and let users refine their request.

### Input panel
- Interest text field.
- Optional category selection.
- Optional skills input.
- Number of results should remain within a sensible supported range.
- Primary action: `Get Recommendations`.

### Recommendation card
Display:
1. Event title and category.
2. Match score, clearly labelled as a model-generated relevance score rather than a probability of attendance or success.
3. Short explanation of why it was recommended.
4. Date, time, and venue.
5. Optional score breakdown if the API returns it.
6. Relevant event action.

### Recommendation score display
- Use a compact progress bar or labelled percentage.
- Do not imply that a 90% score means a 90% chance of attendance.
- Only display score breakdown fields actually returned by the API.
- Keep model details available in a secondary explanation area rather than overwhelming the main card.

### Recommendation page states
- Initial: explain what the user should enter.
- Loading: show progress and prevent duplicate submissions.
- Success: show ranked results.
- Empty: explain that no matching recommendations were returned.
- Error: show a concise message and retry action.
- Cold start: recommendations should still work when no interaction history exists.

## 8. Login and Signup

### Visual layout
Use a centered modal or dedicated page with:
- EventSphere wordmark.
- Clear heading.
- Login/signup mode switch.
- Labeled email and password fields.
- Password visibility toggle.
- Primary submit button.
- Inline validation messages.
- Close action when using a modal.

### Signup fields
- Full name.
- Email address.
- Password.
- Confirm password.

### Login fields
- Email address.
- Password.

### Interaction rules
- Validate obvious formatting issues on the client for usability.
- Always validate credentials and account state on the server.
- Show generic authentication failure messages that do not reveal whether an email exists.
- Display success only after the backend confirms the operation.
- Do not store plaintext passwords in browser storage or logs.
- Provide keyboard focus management and return focus to the trigger when a modal closes.

**Status:** A login/signup UI component was prepared in a previous step, but it is not evidence of a working authentication API.

## 9. Responsive Behavior

Recommended breakpoints:
- Small mobile: up to 480 px.
- Mobile/tablet: 481–768 px.
- Desktop: 769–1199 px.
- Wide desktop: 1200 px and above.

Guidelines:
- Navigation should collapse cleanly on mobile.
- Event cards should become a single column on narrow screens.
- Forms should use full available width without touching viewport edges.
- Dialogs should fit within viewport height and scroll internally if necessary.
- Buttons should have adequate touch targets.
- Avoid fixed-width layouts that overflow on smaller devices.

## 10. Accessibility Requirements

- Use semantic landmarks: `header`, `nav`, `main`, `section`, and `footer`.
- Use actual buttons for actions and anchors for navigation.
- Give every input a visible label.
- Ensure all actions work with keyboard only.
- Use a visible focus indicator.
- Associate validation feedback with the relevant form controls where possible.
- Use `aria-live` or appropriate alert/status semantics for dynamic feedback.
- Do not rely on color alone to communicate errors, success, or selected states.
- Respect `prefers-reduced-motion`.
- Verify text and controls meet WCAG contrast requirements.

## 11. Motion and Feedback

- Keep transitions short and restrained, approximately 150–220 ms.
- Use hover effects only as enhancement, never as the only feedback.
- Avoid motion that blocks form submission or navigation.
- Respect reduced-motion preferences.
- Show loading feedback for asynchronous operations.
- Prevent double-submission during requests.

## 12. Design Components

Recommended reusable components:
- `Navbar`
- `PrimaryButton`
- `SecondaryButton`
- `EventCard`
- `EventGrid`
- `CategoryBadge`
- `SkillTag`
- `SearchBar`
- `FilterPanel`
- `RecommendationForm`
- `RecommendationCard`
- `ScoreBreakdown`
- `AuthModal`
- `FormField`
- `LoadingState`
- `EmptyState`
- `ErrorState`
- `Toast` or inline status message
- `Footer`

Reuse existing components and CSS where practical rather than rewriting the entire frontend.

## 13. Suggested CSS Variables

```css
:root {
  --color-primary: #FF4E55;
  --color-primary-hover: #E8434B;
  --color-text: #171717;
  --color-text-muted: #737373;
  --color-background: #FFFFFF;
  --color-surface: #F7F7F6;
  --color-border: #E5E5E5;
  --color-primary-action: #151515;
  --color-success: #16803C;
  --color-error: #B4232F;
  --radius-card: 16px;
  --radius-control: 10px;
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.06);
  --content-width: 1200px;
}
```

Treat these as proposed tokens. Check the current stylesheet and consolidate duplicates before adding them.

## 14. Design Acceptance Checklist

- [ ] Existing EventSphere wordmark and brand colors are preserved.
- [ ] Navigation works at desktop and mobile widths.
- [ ] Main CTA and secondary actions are visually distinct.
- [ ] Event cards show key details without clutter.
- [ ] Loading, empty, and error states are designed.
- [ ] Recommendation explanations and scores are understandable.
- [ ] Login/signup forms have visible labels and validation feedback.
- [ ] API success messages are only shown after server confirmation.
- [ ] All controls are keyboard accessible.
- [ ] Focus indicators and contrast are checked.
- [ ] Layout has no horizontal overflow on mobile.
- [ ] Existing working features are preserved during implementation.

## 15. Implementation Notes

1. Audit `frontend/src/App.jsx` and `frontend/src/app.css` before changing the current layout.
2. Preserve the current landing page and navigation rather than replacing them wholesale.
3. Build or refine shared components incrementally.
4. Confirm the backend and ML source files exist before designing UI behavior around their APIs.
5. Treat Login and Signup as UI-only until the backend endpoints and secure authentication flow are implemented.
6. Test every design change at desktop and mobile widths.
7. Commit only verified changes and avoid including `.env`, `node_modules`, or Python virtual environments.

## 16. Definition of Design Done

The design is ready when:
- Core user journeys have consistent page layouts and interaction patterns.
- Existing branding is preserved.
- Responsive layouts work without clipping or overflow.
- Form and API states are clearly communicated.
- Accessibility basics are satisfied.
- The design matches implemented functionality and does not imply features that are not operational.
"""
output = "/mnt/data/DESIGN.md"
pypandoc.convert_text(design_md, "md", format="md", outputfile=output, extra_args=["--standalone"])
print(f"Created: {output}")

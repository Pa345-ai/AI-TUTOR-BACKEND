# Design Guidelines: Premium AI Tutoring Platform

## Design Approach

**Selected Approach:** Design System Foundation with EdTech Enhancement
- **Primary System:** Material Design 3 for robust component architecture and accessibility
- **Reference Inspiration:** Khan Academy (learning progression), Duolingo (gamification), Notion (dashboard organization)
- **Design Principles:** 
  - Clarity over decoration - educational content must be easily scannable
  - Progressive disclosure - reveal complexity as users need it
  - Motivational design - celebrate achievements without distraction
  - Role-appropriate interfaces - distinct experiences for students, teachers, parents, admins

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary Brand: 220 85% 55% (Trustworthy education blue)
- Primary Variant: 220 70% 45% (Deeper blue for contrast)
- Success/Progress: 142 76% 36% (Achievement green)
- Warning: 38 92% 50% (Deadline orange)
- Error: 0 72% 51% (Critical red)
- Surface: 0 0% 98% (Clean white background)
- Surface Variant: 220 20% 95% (Card backgrounds)
- On Surface: 220 15% 20% (Primary text)
- On Surface Variant: 220 10% 45% (Secondary text)

**Dark Mode:**
- Primary Brand: 220 75% 65% (Lighter blue for dark backgrounds)
- Primary Variant: 220 85% 55% (Accent blue)
- Success/Progress: 142 60% 45% (Softer achievement green)
- Warning: 38 85% 55% (Softer deadline orange)
- Error: 0 65% 58% (Softer critical red)
- Surface: 220 15% 12% (Deep background)
- Surface Elevated: 220 12% 18% (Card backgrounds)
- On Surface: 220 10% 92% (Primary text)
- On Surface Variant: 220 8% 70% (Secondary text)

**Gamification Accents:**
- XP Gold: 45 95% 50% (Experience points)
- Badge Purple: 270 70% 60% (Achievement badges)
- Streak Fire: 15 90% 55% (Daily streaks)

### B. Typography

**Font Families:**
- Primary: 'Inter' (via Google Fonts) - exceptional readability for UI and content
- Monospace: 'JetBrains Mono' - code snippets and technical content
- Display: 'Inter' at larger weights for headings

**Type Scale:**
- Display (Hero Headlines): text-5xl font-bold (48px)
- H1 (Page Titles): text-3xl font-semibold (30px)
- H2 (Section Headers): text-2xl font-semibold (24px)
- H3 (Card Headers): text-xl font-medium (20px)
- Body Large: text-base font-normal (16px)
- Body: text-sm font-normal (14px)
- Caption: text-xs font-normal (12px)
- Code/Technical: text-sm font-mono (14px monospace)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 1, 2, 4, 6, 8, 12, 16, 24
- Micro spacing (within components): 1, 2, 4
- Component padding: 4, 6, 8
- Section spacing: 8, 12, 16
- Page margins: 16, 24

**Grid System:**
- Dashboard layouts: 12-column grid with gap-6
- Content max-width: max-w-7xl for dashboards, max-w-4xl for content reading
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### D. Component Library

**Navigation:**
- Top Navigation: Fixed header with role-based menu, avatar, notifications bell
- Side Navigation (Desktop): Collapsible sidebar for teachers/admins with icon + label
- Mobile Navigation: Bottom tab bar for students (Chat, Assignments, Progress, Profile)
- Breadcrumbs: Show hierarchy in teacher/admin views

**Cards & Containers:**
- Elevated Cards: rounded-xl shadow-sm with hover:shadow-md transition
- Assignment Cards: Include status badge, due date, progress indicator
- Quiz Cards: Show difficulty level, question count, estimated time
- Chat Messages: Rounded bubbles - AI messages align left, user messages align right

**Interactive Elements:**
- Primary Buttons: Filled with primary color, rounded-lg, px-6 py-3
- Secondary Buttons: Outlined with primary color, same dimensions
- Icon Buttons: Square p-2 rounded-lg with hover background
- Form Inputs: Consistent dark mode treatment, rounded-md, focus:ring-2 focus:ring-primary

**Data Display:**
- Progress Bars: Gradient fills showing completion percentage with smooth animation
- Analytics Charts: Use Chart.js or Recharts with color-coded data series
- Leaderboard Tables: Alternating row backgrounds, rank badges for top 3
- Statistics Cards: Large number display with trend indicators (up/down arrows)

**AI Chat Interface:**
- Message Container: Full-height with scroll, padding for readability
- Input Area: Fixed bottom with textarea, send button, voice input icon
- Code Blocks: Syntax highlighting with copy button, dark theme-aware
- Math Formulas: Rendered with KaTeX, centered display for equations

**Gamification Elements:**
- XP Counter: Animated number with sparkle effect on increase
- Achievement Badges: Circular icons with glow effect when unlocked
- Progress Rings: SVG circular progress with percentage in center
- Streak Calendar: Grid of dots showing daily activity

**Dashboards:**
- Student Dashboard: Hero stats (XP, streak, level), upcoming assignments, recent chat, progress charts
- Teacher Dashboard: Class overview cards, recent submissions, grade distribution chart, quick actions
- Parent Dashboard: Child selector dropdown, performance summary, notification feed
- Admin Dashboard: System metrics, user analytics, payment status, activity logs

**Forms & Data Entry:**
- Assignment Submission: Drag-drop file upload zone, preview thumbnails, file type icons
- Quiz Builder: Question type selector, answer option inputs, point assignment
- Grade Entry: Quick-grade interface with slider or number input, feedback textarea

**Modals & Overlays:**
- Confirmation Dialogs: Centered with backdrop blur, clear action buttons
- AI Feedback Panels: Slide-in from right with generated hints and explanations
- Image Lightbox: Full-screen view with zoom controls for submitted work

### E. Animation Strategy

**Use Sparingly - Only Where Functional:**
- Page Transitions: Subtle fade-in (150ms) for route changes
- Loading States: Skeleton screens for data fetching, spinner for actions
- Success Feedback: Brief scale bounce (200ms) on achievement unlock
- Micro-interactions: Button press feedback, checkbox check animation
- Avoid: Decorative animations, parallax effects, unnecessary motion

## Images & Visuals

**Hero Sections:**
- Landing Page Hero: Large aspirational image of diverse students studying/celebrating (1920x800px)
- Dashboard Hero: Abstract gradient background with floating educational icons (subtle, not distracting)
- Empty States: Friendly illustrations for "no assignments yet", "start your first quiz"

**Placement Strategy:**
- Landing page: Full-width hero image with overlay text
- Feature sections: Icon illustrations (not photos) for feature explanations
- Testimonials: Circular cropped student/parent photos (96x96px)
- Assignment submissions: Thumbnail previews of uploaded work
- Profile sections: Avatar images with fallback initials

## Role-Specific Design Considerations

**Student Interface:**
- Playful but not childish - appropriate for grades 1-13 range
- Large touch targets for younger students on mobile
- Visual progress indicators everywhere (gamification psychology)
- Simplified navigation with clear icons and labels

**Teacher Interface:**
- Density toggle for power users (compact vs comfortable view)
- Bulk action capabilities with multi-select
- Keyboard shortcuts for common actions
- Advanced filtering and sorting controls

**Parent Interface:**
- Summary-first approach - show key metrics immediately
- Translation-friendly (support for multiple languages)
- Clear alerts and notification system
- Easy child switching if multiple children

**Admin Interface:**
- Data-dense tables with pagination and search
- System health indicators and metrics
- Quick access to user management and settings
- Audit trail visibility

## Accessibility & Responsiveness

- WCAG AA compliant color contrast in both light and dark modes
- Focus indicators: 2px ring with 2px offset in primary color
- Keyboard navigation: Logical tab order, escape to close modals
- Screen reader: Semantic HTML, ARIA labels for interactive elements
- Mobile-first: Stack layouts vertically, enlarge touch targets (min 44x44px)
- Responsive images: srcset for different densities, lazy loading below fold
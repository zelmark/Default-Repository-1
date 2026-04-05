# UI/UX Pro Max - Design Intelligence: Complete Reference

## Overview

UI/UX Pro Max is a comprehensive design system containing **50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types** across 10 technology stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS).

## When to Apply This Skill

**Must Use:** Design new pages, create/refactor UI components, choose color schemes, review UI code for UX quality, implement navigation structures, or make product-level design decisions.

**Skip:** Pure backend logic, API/database design, performance optimization unrelated to interface, infrastructure work, or non-visual scripts.

**Decision criteria:** "If the task will change how a feature **looks, feels, moves, or is interacted with**, use this skill."

## Priority-Based Rule Categories (1-10)

The framework uses a 10-tier priority system where Category 1-3 are CRITICAL, 4-5 are HIGH, 6-8 are MEDIUM, and 9-10 are HIGH/LOW respectively:

1. **Accessibility** – Contrast ratios, keyboard navigation, ARIA labels
2. **Touch & Interaction** – 44×44px minimum, 8px spacing, loading feedback
3. **Performance** – Image optimization, lazy loading, layout shift prevention
4. **Style Selection** – Match product type, consistency, SVG icons (no emoji)
5. **Layout & Responsive** – Mobile-first, viewport meta, no horizontal scroll
6. **Typography & Color** – Base 16px, line-height 1.5, semantic color tokens
7. **Animation** – 150-300ms duration, transform/opacity only, motion meaning
8. **Forms & Feedback** – Visible labels, error placement, success states
9. **Navigation Patterns** – Bottom nav ≤5 items, deep linking, predictable back
10. **Charts & Data** – Legends, tooltips, accessible color palettes

## Quick Reference: Critical Rules

### Accessibility (CRITICAL)
- "Minimum 4.5:1 ratio for normal text (large text 3:1)" per Material Design
- Visible focus rings (2–4px)
- Descriptive alt text for meaningful images
- aria-label for icon-only buttons
- Full keyboard navigation support
- Respect prefers-reduced-motion
- Sequential heading hierarchy (h1→h6, no level skip)
- Never convey information by color alone

### Touch & Interaction (CRITICAL)
- "Min 44×44pt (Apple) / 48×48dp (Material)" for touch targets
- "Minimum 8px/8dp gap between touch targets"
- Click/tap for primary interactions (don't rely on hover alone)
- Disable button during async operations; show spinner
- Clear error messages near problem fields
- Use touch-action: manipulation to reduce 300ms delay
- Platform-standard gestures (swipe-back, pinch-zoom)
- Visual feedback within ~100ms of tap
- Safe-area awareness for notch, Dynamic Island, gesture bar

### Performance (HIGH)
- Use WebP/AVIF with responsive images (srcset/sizes)
- Declare width/height or aspect-ratio to prevent layout shift
- Use font-display: swap/optional to avoid invisible text
- Lazy load below-fold images with loading="lazy"
- Virtualize lists with 50+ items
- Keep per-frame work under ~16ms for 60fps
- Use skeleton screens instead of long blocking spinners
- Input latency under ~100ms for taps/scrolls
- Debounce/throttle high-frequency events (scroll, resize, input)

## Design System Workflow

### Step 1: Analyze Requirements
Extract product type, target audience, style keywords, and technology stack.

### Step 2: Generate Design System (REQUIRED)
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

This provides comprehensive recommendations with reasoning, including pattern, style, colors, typography, effects, and anti-patterns.

### Step 2b: Persist Design System
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

Creates `design-system/MASTER.md` (global source of truth) and `design-system/pages/` folder for page-specific overrides.

### Step 3: Supplement with Detailed Searches
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

Available domains: product, style, typography, color, landing, chart, ux, google-fonts, react, web, prompt.

### Step 4: Stack Guidelines
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack react-native
```

## Style Selection Rule

"Match style to product type (use `--design-system` for recommendations)" and maintain consistency across all pages. Use SVG icons (Heroicons, Lucide), not emojis. Choose palette based on product/industry. Align shadows, blur, and radius with chosen style. Respect platform idioms (iOS HIG vs Material). Make hover/pressed/disabled states visually distinct. Use consistent elevation/shadow scale.

## Layout & Responsive Rules

- "width=device-width initial-scale=1 (never disable zoom)" for viewport meta
- Design mobile-first, then scale up to tablet and desktop
- Use systematic breakpoints (e.g., 375 / 768 / 1024 / 1440)
- "Minimum 16px body text on mobile (avoids iOS auto-zoom)"
- "Mobile 35–60 chars per line; desktop 60–75 chars" for line length control
- No horizontal scroll on mobile; ensure content fits viewport width
- Use 4pt/8dp incremental spacing system
- Keep component spacing comfortable for touch
- Consistent max-width on desktop (max-w-6xl / 7xl)
- Define layered z-index scale (e.g., 0 / 10 / 20 / 40 / 100 / 1000)
- Fixed navbar/bottom bar must reserve safe padding
- Avoid nested scroll regions
- Prefer min-h-dvh over 100vh on mobile
- Keep layout readable in landscape orientation
- Show core content first on mobile

## Typography & Color Rules

- "Use 1.5-1.75 for body text" line-height
- "Limit to 65-75 characters per line"
- Match heading/body font personalities
- Use consistent type scale (e.g., 12 14 16 18 24 32)
- "Darker text on light backgrounds (e.g. slate-900 on white)"
- Use platform type system: iOS Dynamic Type styles / Material type roles
- Use font-weight for hierarchy: Bold headings (600–700), Regular body (400), Medium labels (500)
- Define semantic color tokens (primary, secondary, error, surface, on-surface)
- Dark mode uses desaturated/lighter tonal variants, not inverted colors
- Foreground/background pairs must meet 4.5:1 (AA) or 7:1 (AAA)
- Functional color (error red, success green) must include icon/text
- Prefer wrapping over truncation; use ellipsis with tooltip/expand when truncating
- Respect default letter-spacing per platform
- Use tabular/monospaced figures for data columns, prices, and timers
- Use whitespace intentionally to group related items

## Animation Rules

- "Use 150–300ms for micro-interactions; complex transitions ≤400ms"
- Use transform/opacity only; avoid animating width/height/top/left
- Show skeleton or progress indicator when loading exceeds 300ms
- Limit to 1-2 key animated elements per view
- Use ease-out for entering, ease-in for exiting
- Every animation must express cause-effect relationship, not just decoration
- State changes (hover / active / expanded) should animate smoothly
- Maintain spatial continuity (shared element, directional slide)
- Use parallax sparingly; respect reduced-motion
- Prefer spring/physics-based curves for natural feel
- "Exit animations shorter than enter (~60–70% of enter duration)"
- Stagger list/grid items by 30–50ms per item
- Use shared element transitions for visual continuity
- Animations must be interruptible by user tap/gesture
- Never block user input during animation
- Use crossfade for content replacement within same container
- Subtle scale (0.95–1.05) on press for cards/buttons
- Drag, swipe, and pinch must provide real-time visual feedback
- Use translate/scale direction to express hierarchy
- Unify duration/easing tokens globally
- Fading elements should not linger below opacity 0.2
- Modals/sheets should animate from trigger source
- Forward navigation animates left/up; backward animates right/down
- Animations must not cause layout reflow

## Forms & Feedback Rules

- "Use label with for attribute" (visible per input, not placeholder-only)
- "Show error below the related field"
- Show loading then success/error state on submit
- Mark required fields (e.g., asterisk)
- Provide helpful message and action when no content (empty states)
- "Auto-dismiss toasts in 3-5s"
- Confirm before destructive actions
- Provide persistent helper text below complex inputs
- Disabled elements use reduced opacity (0.38–0.5) with cursor change
- Reveal complex options progressively
- Validate on blur (not keystroke); show error after user finishes input
- Use semantic input types (email, tel, number) for correct mobile keyboard
- Provide show/hide toggle for password fields
- Support autocomplete / textContentType attributes
- Allow undo for destructive or bulk actions
- Confirm completed actions with visual feedback (checkmark, toast, color flash)
- Error messages must include recovery path (retry, edit, help link)
- Show step indicator or progress bar for multi-step flows
- Long forms should auto-save drafts
- Confirm before dismissing sheet/modal with unsaved changes
- "Error messages must state cause + how to fix (not just 'Invalid input')"
- Group related fields logically (fieldset/legend or visual grouping)
- Read-only state visually different from disabled
- Auto-focus first invalid field after submit error
- Show summary at top with anchor links for multiple errors
- "Mobile input height >=44px to meet touch target requirements"
- Destructive actions use semantic danger color (red) and separated placement
- Toasts must not steal focus; use aria-live="polite" for announcement
- Form errors use aria-live region or role="alert" for screen readers
- Error and success state colors must meet 4.5:1 contrast ratio
- Request timeout must show error message with retry option

## Navigation Patterns Rules

- "Bottom navigation max 5 items; use labels with icons"
- Use drawer/sidebar for secondary navigation, not primary actions
- "Back navigation must be predictable and consistent; preserve scroll/state"
- "All key screens must be reachable via deep link / URL"
- iOS: use bottom Tab Bar for top-level navigation
- Android: use Top App Bar with navigation icon
- "Navigation items must have both icon and text label"
- Current location must be visually highlighted (color, weight, indicator)
- Primary nav vs secondary nav must be clearly separated
- Modals/sheets must offer clear close/dismiss affordance
- Search must be easily reachable with recent/suggested queries
- Web: use breadcrumbs for 3+ level deep hierarchies
- Navigating back must restore previous scroll position, filter state, input
- Support system gesture navigation without conflict
- Use badges on nav items sparingly; clear after user visits
- Use overflow/more menu when actions exceed available space
- Bottom nav for top-level screens only; never nest sub-navigation inside
- Large screens (>=1024px) prefer sidebar; small screens use bottom/top nav
- Never silently reset navigation stack or jump unexpectedly to home
- Navigation placement must stay same across all pages
- Don't mix Tab + Sidebar + Bottom Nav at same hierarchy level
- Modals must not be used for primary navigation flows
- Move focus to main content region after page transition
- Core navigation must remain reachable from deep pages
- Dangerous actions (delete account, logout) visually separated from normal nav
- Explain why nav destination is unavailable instead of silently hiding

## Charts & Data Rules

- "Match chart type to data type (trend → line, comparison → bar, proportion → pie/donut)"
- Use accessible color palettes; avoid red/green only pairs for colorblind users
- Provide table alternative for accessibility
- Supplement color with patterns, textures, or shapes
- "Always show legend; position near the chart, not detached below a scroll fold"
- Provide tooltips/data labels on hover (Web) or tap (mobile)
- Label axes with units and readable scale
- Charts must reflow or simplify on small screens
- Show meaningful empty state when no data exists
- Use skeleton or shimmer placeholder while chart data loads
- Chart entrance animations must respect prefers-reduced-motion
- For 1000+ data points, aggregate or sample; provide drill-down for detail
- Use locale-aware formatting for numbers, dates, currencies
- Interactive chart elements must have >=44pt tap area or expand on touch
- "Avoid pie/donut for >5 categories; switch to bar chart for clarity"
- Data lines/bars vs background >=3:1; data text labels >=4.5:1
- Legends should be clickable to toggle series visibility
- For small datasets, label values directly on chart
- Tooltip content must be keyboard-reachable and not rely on hover alone
- Data tables must support sorting with aria-sort
- Axis ticks must not be cramped; maintain readable spacing
- Limit information density per chart; split into multiple if needed
- Emphasize data trends over decoration
- Grid lines should be low-contrast (e.g., gray-200)
- Interactive chart elements must be keyboard-navigable
- Provide text summary or aria-label for screen readers
- Data load failure must show error message with retry action
- Offer CSV/image export of chart data
- Maintain clear back-path and hierarchy breadcrumb for drill-down
- Time series charts must clearly label time granularity and allow switching

## Common Icons & Visual Elements Rules

| Rule | Do | Avoid |
|------|-----|--------|
| **Icons** | Use vector-based icons (Lucide, react-native-vector-icons, @expo/vector-icons) | Emojis as structural icons |
| **Assets** | Use SVG or platform vector icons that scale cleanly | Raster PNG icons that blur or pixelate |
| **States** | Use color/opacity/elevation transitions without layout shift | Layout-shifting transforms or visual jitter |
| **Logos** | Use official brand assets per usage guidelines | Guessing logo paths or modifying proportions |
| **Icon sizing** | Define sizes as design tokens (icon-sm, icon-md = 24pt) | Arbitrary values mixed randomly |
| **Stroke** | Use consistent stroke width per visual layer (1.5px or 2px) | Mixing thick and thin styles arbitrarily |
| **Style** | Use one icon style per hierarchy level | Mixing filled and outline icons at same level |
| **Touch** | Minimum 44×44pt interactive area with expanded hitSlop if needed | Small icons without expanded tap area |
| **Alignment** | Align icons to text baseline with consistent padding | Misaligned icons or inconsistent spacing |
| **Contrast** | Follow WCAG: 4.5:1 for small elements, 3:1 minimum for glyphs | Low-contrast icons blending into background |

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis as icons (use SVG instead)
- [ ] All icons from consistent family and style
- [ ] Official brand assets with correct proportions
- [ ] Pressed-state visuals don't shift layout or jitter
- [ ] Semantic theme tokens used consistently

### Interaction
- [ ] All tappable elements provide clear pressed feedback
- [ ] Touch targets meet minimum size (>=44x44pt iOS, >=48x48dp Android)
- [ ] Micro-interaction timing 150-300ms with native easing
- [ ] Disabled states visually clear and non-interactive
- [ ] Screen reader focus order matches visual; descriptive labels
- [ ] Gesture regions avoid nested/conflicting interactions

### Light/Dark Mode
- [ ] Primary text contrast >=4.5:1 in both modes
- [ ] Secondary text contrast >=3:1 in both modes
- [ ] Dividers/borders and states distinguishable both ways
- [ ] Modal/drawer scrim opacity preserves legibility (40-60% black)
- [ ] Both themes tested before delivery

### Layout
- [ ] Safe areas respected for headers, tab bars, bottom CTAs
- [ ] Scroll content not hidden behind fixed/sticky bars
- [ ] Verified on small phone, large phone, tablet (portrait + landscape)
- [ ] Horizontal insets adapt by device size and orientation
- [ ] 4/8dp spacing rhythm maintained across component/section/page
- [ ] Long-form text measure readable on larger devices

### Accessibility
- [ ] All meaningful images/icons have accessibility labels
- [ ] Form fields have labels, hints, and clear error messages
- [ ] Color not the only indicator
- [ ] Reduced motion and dynamic text size supported without breakage
- [ ] Accessibility traits/roles/states (selected, disabled, expanded) announced correctly

## Tips for Better Results

- Use **multi-dimensional keywords** combining product + industry + tone + density
- Try different keywords for same need to explore options
- Use `--design-system` first for full recommendations, then `--domain` to deep-dive
- Always add `--stack react-native` for implementation-specific guidance
- Run `--domain ux "animation accessibility z-index loading"` as final UX validation
- Test on 375px (small phone) and landscape orientation
- Verify reduced-motion enabled and Dynamic Type at largest size
- Check dark mode contrast independently
- Confirm all touch targets >=44pt and no content behind safe areas

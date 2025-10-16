# Design Guidelines: Sistema de Gestión de Árboles Urbanos

## Design Approach: Design System-Based

**Selected System:** Material Design 3  
**Justification:** This is a utility-focused, data-intensive application requiring clear information hierarchy, robust form patterns, and mobile-friendly components for field work. Material Design 3 provides excellent data visualization patterns and responsive components ideal for municipal/urban management systems.

**Key Design Principles:**
1. **Clarity First:** Every data point must be immediately readable and actionable
2. **Field-Optimized:** Large touch targets and high contrast for outdoor use
3. **Systematic Consistency:** Predictable patterns reduce cognitive load for daily users
4. **Data Density Balance:** Information-rich without overwhelming

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 76 65% 45% (earthy green - represents urban forestry)
- Primary Container: 76 45% 90%
- Secondary: 35 70% 50% (warm brown - tree/soil tones)
- Secondary Container: 35 30% 95%
- Surface: 0 0% 98%
- Surface Variant: 0 0% 93%
- Error: 0 65% 51%
- Success: 142 70% 45% (tree health indicator)

**Dark Mode:**
- Primary: 76 70% 70%
- Primary Container: 76 50% 25%
- Secondary: 35 50% 65%
- Secondary Container: 35 35% 20%
- Surface: 0 0% 12%
- Surface Variant: 0 0% 20%

### B. Typography

**Font Family:**
- Primary: 'Inter' from Google Fonts (exceptional readability for data)
- Monospace: 'JetBrains Mono' for IDs and coordinates

**Scale:**
- Display: text-4xl font-bold (tree names, dashboard headers)
- Headline: text-2xl font-semibold (section titles)
- Title: text-xl font-medium (card headers, form labels)
- Body: text-base (main content, table cells)
- Label: text-sm font-medium (input labels, metadata)
- Caption: text-xs (timestamps, helper text)

### C. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., p-4, gap-6, m-8)

**Container Strategy:**
- max-w-7xl for main content areas
- max-w-4xl for forms and detail views
- max-w-sm for mobile-optimized cards
- Fixed sidebar: w-64 on desktop, full-width drawer on mobile

**Grid Patterns:**
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Data tables: Full-width responsive with horizontal scroll
- Form layouts: Single column on mobile, 2-column on desktop (md:grid-cols-2)

### D. Component Library

**Navigation:**
- Top app bar with breadcrumbs and global search
- Left sidebar navigation (collapsible on mobile)
- Bottom navigation bar for mobile (sticky, 4-5 primary actions)

**Data Entry:**
- Material-style outlined text inputs with floating labels
- Segmented buttons for status selection (Vivo/Muerto/Extraído)
- Date pickers with calendar dropdown
- Autocomplete comboboxes for species and locations
- File upload zones for tree photos (drag-and-drop)
- Multi-step forms for complex registrations

**Data Display:**
- Cards with elevation shadow (shadow-md) for tree records
- Data tables with sticky headers and zebra striping
- Chips for status badges (rounded-full px-3 py-1)
- Progress indicators for maintenance schedules
- Timeline component for maintenance history

**Dashboard Elements:**
- Stat cards with icon, number, and trend indicator
- Quick action FAB (Floating Action Button) for "Registrar Árbol"
- Alert banners for urgent maintenance (warning/error states)
- Map view for tree locations (embedded Google Maps or Leaflet)

**Overlays:**
- Modal dialogs for confirmations (max-w-md)
- Slide-over panels for detail views (w-96)
- Toast notifications (top-right position) for action feedback
- Bottom sheets on mobile for filters and actions

### E. Visual Patterns

**Tree Record Card Structure:**
```
[Tree Photo Thumbnail] 
Especie Name | Status Chip
Dirección + Barrio (text-sm text-gray-600)
Última Mantención: Date (text-xs)
[Ver Detalle Button]
```

**Dashboard Layout:**
- Hero stats row (3-4 cards): Total árboles, Por mantener, Extraídos este mes, Costo total
- Below: 2-column layout → Left: Maintenance alerts list, Right: Map view
- Bottom: Recent activity feed

**Form Hierarchy:**
- Section headers with divider lines (border-b-2)
- Grouped fields in outlined containers (border rounded-lg p-6)
- Required fields marked with red asterisk
- Helper text below inputs (text-gray-500 text-sm)

### F. Interactions

**Minimal Animations (only where they add clarity):**
- Smooth transitions for status changes (transition-colors duration-200)
- Slide-in for mobile navigation drawer (transform translate-x)
- Fade-in for toast notifications (animate-in)
- NO decorative animations or scroll effects

**Touch Optimization:**
- Minimum 44px touch targets for mobile
- Generous padding on interactive elements (p-3 minimum)
- Clear focus states with ring-2 ring-primary

## Images

**Hero Section:** No large hero image - this is a utility application  

**Tree Photos:**
- Thumbnail size: 80x80px in lists, 320x320px in detail views
- Placeholder when no photo: Icon with tree silhouette on primary/10 background
- Location in cards: Top-left corner or full-width header

**Dashboard Icons:**
- Use Material Icons CDN for consistent iconography
- Icon sizes: 24px for buttons, 32px for stat cards, 20px for navigation

## Mobile-First Considerations

- Sticky bottom navigation with icons + labels
- Swipeable cards for quick actions
- Full-screen forms on mobile with sticky header
- Camera integration for tree photos (direct upload)
- Offline-capable data entry (sync when online)
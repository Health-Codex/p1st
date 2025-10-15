# People First Urgent Care - Header System Implementation Guide

## Overview
This guide explains how to implement the standardized header system across all pages of the People First Urgent Care website.

## File Structure
```
assets/
├── css/
│   └── header-system-complete.css    # Complete header styles
├── js/
│   └── header-system.js              # Header functionality
└── images/
    └── logo.png                      # Site logo

includes/
└── header.html                       # Standardized header template

docs/
└── header-implementation-guide.md    # This guide
```

## Implementation Steps

### 1. Include Required Files
Add these files to every page in the `<head>` section:

```html
<!-- Header System CSS -->
<link rel="stylesheet" href="assets/css/header-system-complete.css">

<!-- Header System JavaScript -->
<script src="assets/js/header-system.js" defer></script>
```

### 2. Include Header HTML
For static HTML pages, copy the content from `includes/header.html` and paste it immediately after the opening `<body>` tag.

### 3. Update Navigation Links
Ensure all navigation links point to the correct pages:
- Update relative paths based on page location
- Verify all dropdown links are functional
- Test mobile menu functionality

### 4. Page-Specific Customization
- Add `active` class to current page navigation link
- Update page title and meta descriptions
- Ensure proper semantic HTML structure

## Features Included

### Desktop Navigation
- Grid-based layout for optimal space distribution
- Hover dropdowns for Patient Services and Locations
- Professional styling with smooth animations
- Accessibility-compliant keyboard navigation

### Mobile Navigation
- Hamburger menu toggle
- Slide-out mobile menu
- Collapsible dropdown sections
- Touch-friendly interface

### Responsive Design
- Breakpoints at 1300px, 1200px, and 1024px
- Optimized spacing and font sizes
- Mobile-first approach

### Accessibility Features
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Skip links

## CSS Classes Reference

### Header Structure
- `.site-header` - Main header container
- `.top-bar` - Contact information bar
- `.main-header` - Navigation header
- `.header-container` - Grid layout container

### Navigation
- `.nav-container` - Navigation wrapper
- `.nav-menu` - Navigation list
- `.nav-item` - Individual navigation items
- `.nav-link` - Navigation links
- `.has-dropdown` - Items with dropdown menus

### Dropdowns
- `.dropdown-menu` - Dropdown container
- `.dropdown-item` - Dropdown links
- `.dropdown-icon` - Dropdown indicator

### Mobile Menu
- `.mobile-toggle` - Hamburger menu button
- `.mobile-menu` - Mobile menu container
- `.mobile-nav-link` - Mobile navigation links
- `.mobile-dropdown` - Mobile dropdown sections

### Action Buttons
- `.action-buttons` - Button container
- `.header-btn` - Header button styling
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style

## JavaScript API

### HeaderSystem Class
The header system is automatically initialized when the page loads.

#### Methods
- `toggleMobileMenu()` - Toggle mobile menu visibility
- `closeMobileMenu()` - Close mobile menu
- `setActivePage()` - Highlight current page in navigation

#### Events
- Mobile menu toggle
- Dropdown interactions
- Keyboard navigation
- Window resize handling

## Testing Checklist

### Desktop Testing
- [ ] All navigation links work correctly
- [ ] Dropdown menus appear on hover
- [ ] Action buttons are visible and functional
- [ ] Grid layout displays properly
- [ ] Keyboard navigation works

### Mobile Testing
- [ ] Hamburger menu toggles correctly
- [ ] Mobile menu slides in/out smoothly
- [ ] Dropdown sections expand/collapse
- [ ] Touch interactions work properly
- [ ] Menu closes when clicking overlay

### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard-only navigation
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast meets standards

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations
- CSS Grid for efficient layout
- Hardware acceleration for animations
- Optimized JavaScript event handling
- Minimal DOM manipulation
- Efficient CSS selectors

## Troubleshooting

### Common Issues
1. **Dropdown not showing**: Check z-index and overflow settings
2. **Mobile menu not working**: Verify JavaScript is loaded
3. **Layout breaking**: Check grid column definitions
4. **Links not working**: Verify relative paths are correct

### Debug Mode
Add `?debug=true` to URL to enable console logging for troubleshooting.

## Maintenance
- Update navigation links when adding new pages
- Test across all supported browsers after changes
- Validate HTML and CSS regularly
- Monitor performance metrics
- Keep accessibility standards current

## Support
For questions or issues with the header system, refer to the CSS and JavaScript files for detailed comments and implementation notes.

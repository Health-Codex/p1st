# Mobile Navigation System Documentation
## People First Urgent Care Website

### Overview
This document explains the centralized mobile navigation system implemented across the People First Urgent Care website. The system provides a consistent, accessible, and responsive mobile navigation experience on all pages.

---

## System Architecture

### Core Components

#### 1. HTML Structure
Every page must include this header injection point:
```html
<!-- Header Include Hook -->
<div data-include="header"></div>
```

#### 2. CSS System
Required CSS file (must be loaded last):
```html
<link rel="stylesheet" href="assets/css/header-system-complete.css">
```

#### 3. JavaScript System
Required JavaScript files (in this exact order):
```html
<!-- Header System JavaScript -->
<script src="assets/js/header-inline.js" defer></script>
<script src="assets/js/footer-inline.js" defer></script>
<script src="assets/js/core/header-system-new.js" defer></script>
```

---

## Mobile Navigation Features

### Visual Design
- **Hamburger Menu**: 3-line animated toggle button (transforms to X when active)
- **Slide-in Panel**: Mobile menu slides in from the right side
- **Overlay Backdrop**: Semi-transparent overlay covers page content
- **Touch-Friendly**: 44px minimum touch targets for accessibility
- **Brand Colors**: Uses primary green (#05A65C) for active states

### Functionality
- **Toggle Behavior**: Click hamburger to open/close menu
- **Multiple Close Methods**: X button, overlay click, or Escape key
- **Dropdown Menus**: Expandable submenus for "Patient Services" and "Locations"
- **Body Scroll Lock**: Prevents page scrolling when menu is open
- **Focus Management**: Proper keyboard navigation and screen reader support

### Accessibility Features
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Tab through menu items, Escape to close
- **Focus Trapping**: Focus stays within mobile menu when open
- **High Contrast**: Meets WCAG contrast requirements
- **Touch Targets**: All interactive elements meet 44px minimum size

---

## File Structure

### Key Files
```
assets/
├── css/
│   └── header-system-complete.css     # Complete mobile nav styling
├── js/
│   ├── header-inline.js               # Header HTML injection
│   ├── footer-inline.js               # Footer HTML injection
│   └── core/
│       └── header-system-new.js       # Mobile nav functionality
└── images/
    └── logo_peoplefirst-01.svg        # Logo used in mobile menu
```

### HTML Template (in header-inline.js)
The mobile navigation HTML structure includes:
- Mobile toggle button (hamburger)
- Mobile menu overlay
- Mobile menu panel with header, navigation, and action buttons
- Dropdown toggles for submenus

---

## Browser Compatibility

### File:// Protocol Support
✅ **Works with direct file access** - No web server required
- Uses JavaScript injection instead of server-side includes
- All functionality works with `file://` URLs
- Perfect for local development and testing

### Supported Browsers
- ✅ Chrome/Chromium (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, etc.)

### Responsive Breakpoints
- **Desktop**: > 768px (hamburger menu hidden)
- **Mobile**: ≤ 768px (hamburger menu visible)
- **Small Mobile**: ≤ 480px (optimized spacing)

---

## Maintenance Guide

### Adding New Pages
To add the mobile navigation to a new page:

1. **Add Header Include**:
   ```html
   <div data-include="header"></div>
   ```

2. **Include CSS** (load last):
   ```html
   <link rel="stylesheet" href="assets/css/header-system-complete.css">
   ```

3. **Include JavaScript** (before closing `</body>`):
   ```html
   <script src="assets/js/header-inline.js" defer></script>
   <script src="assets/js/footer-inline.js" defer></script>
   <script src="assets/js/core/header-system-new.js" defer></script>
   ```

### Updating Navigation Links
To modify navigation links, edit the `HEADER_HTML` template in:
**File**: `assets/js/header-inline.js`

**Desktop Navigation** (lines ~40-90):
```html
<ul class="nav-menu">
    <li class="nav-item">
        <a href="index.html" class="nav-link">Home</a>
    </li>
    <!-- Add/modify links here -->
</ul>
```

**Mobile Navigation** (lines ~135-200):
```html
<ul class="mobile-nav-menu">
    <li class="mobile-nav-item">
        <a href="index.html" class="mobile-nav-link" data-page="home">Home</a>
    </li>
    <!-- Add/modify links here -->
</ul>
```

### Adding Dropdown Menus
For new dropdown menus in mobile navigation:

1. **Add dropdown toggle**:
   ```html
   <li class="mobile-nav-item">
       <a href="page.html" class="mobile-nav-link">
           Menu Name
           <button class="mobile-dropdown-toggle" aria-label="Toggle Menu Name">
               <i class="fa-solid fa-chevron-down"></i>
           </button>
       </a>
       <div class="mobile-dropdown">
           <a href="sub1.html" class="mobile-dropdown-item">Submenu Item 1</a>
           <a href="sub2.html" class="mobile-dropdown-item">Submenu Item 2</a>
       </div>
   </li>
   ```

2. **JavaScript automatically handles** dropdown functionality

---

## Troubleshooting

### Common Issues

**Mobile menu not appearing:**
- ✅ Check that `header-system-complete.css` is loaded
- ✅ Verify `header-inline.js` is included
- ✅ Ensure `data-include="header"` div exists

**Hamburger button not working:**
- ✅ Check that `header-system-new.js` is loaded
- ✅ Verify no JavaScript errors in browser console
- ✅ Ensure proper script loading order

**Styling issues:**
- ✅ Confirm `header-system-complete.css` loads LAST
- ✅ Check for CSS conflicts with other stylesheets
- ✅ Verify Font Awesome icons are loaded

**File:// protocol issues:**
- ✅ Ensure all file paths are relative (no absolute URLs)
- ✅ Check that all assets exist in correct directories
- ✅ Verify no CORS-related JavaScript errors

### Testing Checklist
- [ ] Mobile menu opens/closes with hamburger button
- [ ] Overlay click closes menu
- [ ] Escape key closes menu
- [ ] Dropdown menus expand/collapse
- [ ] All navigation links work
- [ ] Touch targets are 44px minimum
- [ ] Keyboard navigation works
- [ ] Works on actual mobile devices
- [ ] Works with file:// protocol

---

## Performance Considerations

### Optimizations Implemented
- **Deferred Loading**: All scripts use `defer` attribute
- **GPU Acceleration**: CSS transforms use `translateZ(0)`
- **Throttled Events**: Scroll and resize events are throttled
- **Efficient Selectors**: Cached DOM elements for better performance

### Best Practices
- Keep `header-system-complete.css` as the last CSS file
- Always use `defer` attribute on JavaScript files
- Test on actual mobile devices for best results
- Monitor console for any JavaScript errors

---

## Version History
- **v1.0**: Initial mobile navigation implementation
- **v1.1**: Added file:// protocol compatibility
- **v1.2**: Enhanced accessibility features
- **v1.3**: Standardized across all pages (current)

---

## Support
For questions or issues with the mobile navigation system, refer to this documentation or check the browser console for error messages.

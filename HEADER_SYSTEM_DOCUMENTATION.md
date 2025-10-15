# Unified Header System Documentation

## 🎯 Overview

The Unified Header System consolidates all header and mobile menu implementations into a single, maintainable solution for the People First Urgent Care website. This system resolves conflicts between multiple header implementations and ensures consistent functionality across all pages.

## ✅ Problem Solved

### **Mobile Menu Logo Issue**
- **Problem**: Logo not displaying in mobile menu (0px width/height)
- **Root Cause**: CSS conflicts between multiple header implementations
- **Solution**: Universal CSS selectors with !important declarations

### **Multiple Conflicting Systems**
- **Before**: 4+ different header implementations
  - `header-inline.js`
  - `includes/header.html` 
  - `header-system-new.js`
  - `mobile-menu-fix.js`
- **After**: Single unified system with backward compatibility

## 📁 File Structure

```
assets/
├── js/
│   └── unified-header-system.js     # Main JavaScript system
├── css/
│   ├── unified-header-system.css    # Unified CSS styles
│   └── header-system-complete.css   # Updated with fixes
includes/
└── header.html                      # Updated structure
```

## 🔧 Implementation

### 1. CSS Logo Fix (Critical)

The universal CSS selector ensures logo visibility across all implementations:

```css
.mobile-menu-logo img,
.mobile-logo,
.mobile-menu img[alt*="People First"],
.mobile-menu img[src*="logo"] {
    height: 35px !important;
    width: auto !important;
    max-width: 140px !important;
    min-height: 35px !important;
    min-width: 50px !important;
    display: block !important;
    object-fit: contain !important;
}
```

### 2. JavaScript System

The `UnifiedHeaderSystem` class provides:
- Automatic mobile menu creation
- Event handling for menu interactions
- Submenu functionality
- Accessibility features
- Responsive behavior

### 3. HTML Structure

Standardized mobile menu structure:
```html
<nav class="mobile-menu" id="mobile-menu">
    <div class="mobile-menu-header">
        <div class="mobile-menu-logo">
            <img src="assets/images/logo_peoplefirst-01.svg" alt="People First Urgent Care">
        </div>
        <button class="mobile-menu-close">×</button>
    </div>
    <ul class="mobile-menu-nav">
        <!-- Navigation items -->
    </ul>
</nav>
```

## 🚀 Usage

### Quick Implementation

1. **Include CSS files** (in order):
```html
<link rel="stylesheet" href="assets/css/header-system-complete.css">
<link rel="stylesheet" href="assets/css/unified-header-system.css">
```

2. **Include JavaScript**:
```html
<script src="assets/js/unified-header-system.js"></script>
```

3. **Add hamburger button** to your header:
```html
<button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
    <i class="fa-solid fa-bars"></i>
</button>
```

### Advanced Usage

```javascript
// Custom initialization
const headerSystem = new UnifiedHeaderSystem();

// Access methods
headerSystem.openMenu();
headerSystem.closeMenu();
headerSystem.toggleMenu();
```

## 📱 Responsive Behavior

- **Desktop (>768px)**: Mobile menu hidden
- **Tablet (768px)**: Mobile menu available
- **Mobile (480px)**: Logo scales to 28px height
- **Small Mobile (360px)**: Logo scales to 24px height

## ♿ Accessibility Features

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus management** when menu opens/closes
- **Escape key** closes menu
- **Reduced motion** support

## 🔄 Migration Guide

### From Existing Systems

1. **Keep existing HTML** - The system is backward compatible
2. **Update CSS includes** - Add unified-header-system.css
3. **Replace JS includes** - Use unified-header-system.js instead of multiple files
4. **Test functionality** - Verify mobile menu works correctly

### Removing Old Files (Optional)

After confirming the unified system works:
- Remove `header-inline.js`
- Remove `mobile-menu-fix.js` 
- Keep `header-system-new.js` if used for other features

## 🛠️ Customization

### Logo Styling
```css
.mobile-menu-logo img {
    height: 40px !important; /* Custom height */
    max-width: 160px !important; /* Custom max width */
}
```

### Menu Colors
```css
.mobile-menu {
    background: #your-color;
}

.mobile-menu-nav a:hover {
    background: #your-hover-color;
}
```

### Animation Speed
```css
.mobile-menu {
    transition: right 0.5s ease; /* Slower animation */
}
```

## 🧪 Testing

### Test Page
Use `unified-header-test.html` to verify:
- Logo displays correctly
- Menu opens/closes smoothly
- Responsive behavior works
- Accessibility features function

### Manual Testing Checklist
- [ ] Logo visible in mobile menu
- [ ] Menu opens with hamburger button
- [ ] Menu closes with X button
- [ ] Menu closes when clicking outside
- [ ] Menu closes with Escape key
- [ ] Submenus expand/collapse
- [ ] Responsive scaling works
- [ ] Keyboard navigation works

## 🐛 Troubleshooting

### Logo Not Showing
1. Check image path: `assets/images/logo_peoplefirst-01.svg`
2. Verify CSS file load order
3. Check for CSS conflicts in browser dev tools
4. Ensure `!important` declarations are present

### Menu Not Opening
1. Verify hamburger button has correct class/selector
2. Check JavaScript console for errors
3. Ensure unified-header-system.js is loaded
4. Verify Font Awesome is loaded for icons

### Styling Issues
1. Check CSS file load order
2. Verify CSS custom properties are defined
3. Use browser dev tools to inspect computed styles
4. Check for conflicting CSS rules

## 📞 Support

For issues or questions about the header system:
1. Check this documentation first
2. Test with `unified-header-test.html`
3. Use browser dev tools to debug
4. Review console logs for error messages

## 🔄 Future Updates

To modify the header system:
1. **CSS changes**: Edit `unified-header-system.css`
2. **JavaScript changes**: Edit `unified-header-system.js`
3. **Structure changes**: Update the `createMobileMenu()` method
4. **Test changes**: Use the test page to verify functionality

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-28  
**Author**: People First Urgent Care Development Team

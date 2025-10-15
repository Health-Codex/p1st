# CSS Loading Order Standard
## People First Urgent Care Website

### **CRITICAL: CSS Loading Order Requirements**

The CSS files **MUST** be loaded in this exact order to ensure proper navigation functionality:

```html
<!-- CSS Loading Order - DO NOT CHANGE -->
<link rel="stylesheet" href="assets/css/core/mobile-optimizations.css">
<link rel="stylesheet" href="assets/css/components/compact-layout.css">
<link rel="stylesheet" href="assets/css/components/advanced-effects.css">
<link rel="stylesheet" href="assets/css/core/custom-redesign.css">
<link rel="stylesheet" href="assets/css/header-system-complete.css">
```

### **Why This Order Matters**

1. **mobile-optimizations.css** - Base mobile styles and responsive breakpoints
2. **compact-layout.css** - Layout foundation and grid systems
3. **advanced-effects.css** - Animations and visual effects
4. **custom-redesign.css** - Site-specific styling and overrides
5. **header-system-complete.css** - Navigation system styles (MUST BE LAST)

### **Critical Rule: header-system-complete.css MUST Load Last**

The `header-system-complete.css` file contains the navigation system styles and **MUST** be loaded last to ensure proper CSS specificity. Loading it earlier causes navigation display issues.

### **Standard HTML Template**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>Page Title - People First Urgent Care</title>
    <meta name="description" content="Page description">

    <!-- Favicon -->
    <link rel="icon" href="assets/images/favicon.ico" type="image/x-icon">

    <!-- CSS - EXACT ORDER REQUIRED -->
    <link rel="stylesheet" href="assets/css/core/mobile-optimizations.css">
    <link rel="stylesheet" href="assets/css/components/compact-layout.css">
    <link rel="stylesheet" href="assets/css/components/advanced-effects.css">
    <link rel="stylesheet" href="assets/css/core/custom-redesign.css">
    <link rel="stylesheet" href="assets/css/header-system-complete.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

### **File Organization Standards**

#### **Directory Structure**
```
/
├── assets/
│   ├── css/
│   │   ├── core/
│   │   │   ├── mobile-optimizations.css
│   │   │   └── custom-redesign.css
│   │   └── components/
│   │       ├── compact-layout.css
│   │       └── advanced-effects.css
│   │   └── header-system-complete.css
│   ├── js/
│   └── images/
├── docs/
├── templates/
└── [page].html files
```

#### **Files to Keep**
- All main HTML files (index.html, about.html, etc.)
- Assets directory (CSS, JS, images)
- Documentation in docs/
- Templates directory
- Configuration files (netlify.toml, robots.txt)

#### **Files to Remove**
- Backup files (*.backup-*)
- Old WordPress directories
- Unused shell scripts
- Outdated documentation

### **Quality Assurance Checklist**

Before deploying any changes:

1. ✅ Verify CSS loading order matches standard
2. ✅ Test desktop navigation visibility
3. ✅ Test dropdown menu functionality
4. ✅ Test mobile navigation
5. ✅ Test cross-page consistency
6. ✅ Validate HTML structure
7. ✅ Check for broken links

### **Common Issues and Solutions**

**Issue**: Navigation not visible on desktop
**Solution**: Check CSS loading order - ensure header-system-complete.css loads last

**Issue**: Dropdown menus not working
**Solution**: Verify JavaScript files are loading correctly

**Issue**: Mobile navigation broken
**Solution**: Check mobile-optimizations.css is loading first

### **Maintenance Guidelines**

1. **Never change CSS loading order** without testing
2. **Always test on multiple pages** after changes
3. **Use consistent file naming** conventions
4. **Document any new CSS files** and their required position
5. **Regular cleanup** of unused files

---

**Last Updated**: January 31, 2025
**Version**: 1.0

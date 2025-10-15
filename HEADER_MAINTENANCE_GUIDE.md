# 🎯 HEADER & MOBILE NAVIGATION MAINTENANCE GUIDE
## People First Urgent Care Website

### 🚀 QUICK START: Making Site-Wide Changes

**Want to update navigation links across ALL pages?** 
👉 **Edit ONE file**: `assets/js/header-inline.js`

**Want to update mobile menu styling?**
👉 **Edit ONE file**: `assets/css/header-system-complete.css`

**Want to update mobile menu functionality?**
👉 **Edit ONE file**: `assets/js/core/header-system-new.js`

---

## 🎛️ CENTRALIZED CONTROL SYSTEM

### Single Source of Truth Architecture
```
📁 assets/js/header-inline.js          ← 🎯 EDIT HERE for navigation links
📁 assets/css/header-system-complete.css ← 🎯 EDIT HERE for styling  
📁 assets/js/core/header-system-new.js   ← 🎯 EDIT HERE for functionality
```

**✅ Result**: Changes automatically apply to ALL 18+ pages instantly!

---

## 📝 COMMON MAINTENANCE TASKS

### 1. Adding a New Navigation Link

**File to edit**: `assets/js/header-inline.js`

**Desktop Navigation** (around line 50):
```html
<li class="nav-item">
    <a href="new-page.html" class="nav-link">New Page</a>
</li>
```

**Mobile Navigation** (around line 150):
```html
<li class="mobile-nav-item">
    <a href="new-page.html" class="mobile-nav-link" data-page="new-page">New Page</a>
</li>
```

### 2. Adding a Dropdown Menu

**File to edit**: `assets/js/header-inline.js`

**Desktop Dropdown** (around line 60):
```html
<li class="nav-item has-dropdown">
    <a href="main-page.html" class="nav-link">
        Main Page
        <span class="dropdown-icon">▼</span>
    </a>
    <div class="dropdown-menu">
        <a href="sub1.html" class="dropdown-item">Sub Page 1</a>
        <a href="sub2.html" class="dropdown-item">Sub Page 2</a>
    </div>
</li>
```

**Mobile Dropdown** (around line 160):
```html
<li class="mobile-nav-item">
    <a href="main-page.html" class="mobile-nav-link" data-page="main">
        Main Page
        <button class="mobile-dropdown-toggle" aria-label="Toggle Main Page menu">
            <i class="fa-solid fa-chevron-down"></i>
        </button>
    </a>
    <div class="mobile-dropdown">
        <a href="sub1.html" class="mobile-dropdown-item">Sub Page 1</a>
        <a href="sub2.html" class="mobile-dropdown-item">Sub Page 2</a>
    </div>
</li>
```

### 3. Updating Logo or Contact Info

**File to edit**: `assets/js/header-inline.js`

**Top Bar Contact** (around line 25):
```html
<div class="top-bar-info">
    <span>Questions? <a href="tel:901-473-0582">901-473-0582</a></span>
    <span><a href="mailto:info@peoplefirstcare.com">info@peoplefirstcare.com</a></span>
</div>
```

**Logo** (around line 40):
```html
<div class="logo">
    <a href="index.html" aria-label="People First Urgent Care - Home">
        <img src="assets/images/logo_peoplefirst-01.svg"
             alt="People First Urgent Care"
             width="auto"
             height="50">
    </a>
</div>
```

### 4. Updating Action Buttons

**File to edit**: `assets/js/header-inline.js`

**Header Buttons** (around line 110):
```html
<div class="action-buttons">
    <a href="pay.html" class="btn btn-secondary header-btn">Pay Now</a>
    <a href="save-your-spot.html" class="btn btn-primary header-btn">
        <span class="btn-icon">📅</span>
        Save Your Spot
    </a>
</div>
```

---

## 🔧 ADDING NEW PAGES TO THE SYSTEM

### Step 1: Create Your New Page
Use this template for any new HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title - People First Urgent Care</title>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- CRITICAL: Load header CSS LAST -->
    <link rel="stylesheet" href="assets/css/header-system-complete.css">
</head>
<body>
    <!-- CRITICAL: Header injection point -->
    <div data-include="header"></div>

    <main id="main-content">
        <!-- Your page content here -->
    </main>

    <!-- Footer injection point -->
    <div data-include="footer"></div>

    <!-- CRITICAL: Load scripts in EXACT order with defer -->
    <script src="assets/js/header-inline.js" defer></script>
    <script src="assets/js/footer-inline.js" defer></script>
    <script src="assets/js/core/header-system-new.js" defer></script>
</body>
</html>
```

### Step 2: Verify Implementation
Run the verification script:
```bash
./scripts/verify-header-system.sh
```

---

## 🧪 TESTING YOUR CHANGES

### 1. Test Page
Open `mobile-nav-test.html` in your browser to verify:
- ✅ Mobile menu opens/closes
- ✅ Dropdown menus work
- ✅ All links function correctly
- ✅ Responsive design works

### 2. Cross-Page Testing
Test navigation on multiple pages:
- ✅ Home page (`index.html`)
- ✅ About page (`about.html`) 
- ✅ Services page (`patient-services.html`)
- ✅ Contact page (`contact.html`)

### 3. Mobile Testing
- ✅ Resize browser to mobile width
- ✅ Use browser dev tools mobile simulation
- ✅ Test on actual mobile devices

---

## 🚨 TROUBLESHOOTING

### Mobile Menu Not Appearing
1. Check browser console for JavaScript errors
2. Verify `header-system-complete.css` is loaded
3. Ensure `header-inline.js` is included
4. Confirm `data-include="header"` div exists

### Navigation Links Not Working
1. Check file paths are correct and relative
2. Verify target pages exist
3. Test with file:// protocol

### Styling Issues
1. Ensure `header-system-complete.css` loads LAST
2. Check for CSS conflicts
3. Verify Font Awesome is loaded

---

## 📊 CURRENT SYSTEM STATUS

**✅ COMPLETE IMPLEMENTATION**
- **18 main pages** with consistent mobile navigation
- **File:// protocol** compatible (no web server required)
- **Centralized maintenance** via single file editing
- **Accessibility compliant** with ARIA labels and keyboard navigation
- **Touch-friendly design** with 44px minimum touch targets

**📱 Mobile Navigation Features**
- Hamburger menu with smooth animations
- Slide-in mobile panel from right
- Dropdown submenus for services and locations
- Overlay backdrop with blur effect
- Multiple close methods (X, overlay, Escape key)
- Body scroll prevention when menu open
- Focus management for screen readers

---

## 🎯 REMEMBER: ONE FILE = SITE-WIDE CHANGES

**Navigation Links**: Edit `assets/js/header-inline.js`
**Mobile Styling**: Edit `assets/css/header-system-complete.css`  
**Menu Functionality**: Edit `assets/js/core/header-system-new.js`

**Changes automatically apply to ALL pages!** 🚀

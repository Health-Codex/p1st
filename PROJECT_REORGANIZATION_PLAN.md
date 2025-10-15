# People First Urgent Care - Project Reorganization Plan

## Current State Analysis
- **Total backup files**: 172 (.bak, .bak.fix, .bak.mobile, etc.)
- **Shell scripts**: 19 (.sh files)
- **HTML files**: Multiple pages in root directory
- **CSS files**: 20+ files in css/ directory
- **JS files**: 15+ files in js/ directory
- **Images**: Well-organized in images/ directory
- **Main issue**: File organization chaos, not mobile responsiveness

## Backup Created
- **Location**: `/Users/austinshinaberry/Downloads/p1st-backup-20250131-174635`
- **Status**: Complete backup of current state before reorganization

## Proposed New Structure

```
/
├── assets/
│   ├── css/
│   │   ├── core/
│   │   │   ├── custom-redesign.css
│   │   │   ├── normalize.css
│   │   │   └── mobile-optimizations.css
│   │   ├── components/
│   │   │   ├── compact-layout.css
│   │   │   ├── advanced-effects.css
│   │   │   ├── splash-screen.css
│   │   │   └── dashboard.css
│   │   ├── features/
│   │   │   ├── urgent-care-assessment.css
│   │   │   ├── urgent-care-assessment-modal.css
│   │   │   ├── cta-enhanced.css
│   │   │   └── healthcare-cta-green.css
│   │   └── legacy/
│   │       └── custom.css
│   ├── js/
│   │   ├── core/
│   │   │   ├── main.js
│   │   │   ├── custom.js
│   │   │   └── main-redesign.js
│   │   ├── mobile/
│   │   │   ├── mobile-optimizations.js
│   │   │   ├── mobile-enhancements.js
│   │   │   └── mobile-menu-fix.js
│   │   ├── features/
│   │   │   ├── urgent-care-assessment.js
│   │   │   ├── splash-animation.js
│   │   │   ├── splash-screen.js
│   │   │   ├── cta-animations.js
│   │   │   ├── testimonials.js
│   │   │   └── back-to-top.js
│   │   └── interactions/
│   │       └── advanced-interactions.js
│   └── images/
│       ├── heroes/
│       ├── services/
│       ├── team/
│       ├── locations/
│       ├── icons/
│       └── ui/
├── pages/
│   ├── about.html
│   ├── services.html
│   ├── locations.html
│   ├── contact.html
│   └── [other HTML pages]
├── backup/
│   ├── css-backups/
│   ├── js-backups/
│   ├── html-backups/
│   └── misc-backups/
├── scripts/
│   ├── development/
│   ├── deployment/
│   └── maintenance/
├── docs/
│   ├── README.md
│   ├── CHANGELOG.md
│   └── DEPLOYMENT.md
├── design/
│   ├── styles.css
│   └── scripts.js
├── index.html
├── package.json
├── package-lock.json
└── .gitignore
```

## File Reference Updates Required

### HTML Files to Update:
1. **index.html**: Update 9 CSS and 11 JS file paths
2. **about.html**: Update 5 CSS and 4 JS file paths
3. **All other HTML files**: Update their respective CSS/JS references

### CSS Files to Update:
1. **custom.css**: Update image references from `../images/` to `../images/`
2. **Other CSS files**: Most use data URIs, minimal updates needed

## Implementation Strategy

### Phase 1: Backup Files Cleanup (Priority: HIGH)
- Move 172 backup files to backup/ directory with proper categorization
- Immediate impact: Declutter root directory

### Phase 2: Shell Scripts Organization (Priority: MEDIUM)
- Move 19 shell scripts to scripts/ directory with categorization
- Update any scripts that reference file paths

### Phase 3: Asset Reorganization (Priority: HIGH)
- Move CSS files to assets/css/ with logical grouping
- Move JS files to assets/js/ with logical grouping
- Update all HTML file references

### Phase 4: Image Organization (Priority: LOW)
- Images are already well-organized, minor improvements only
- Categorize into subdirectories for better organization

### Phase 5: Documentation (Priority: MEDIUM)
- Create comprehensive documentation
- Update README files

## Risk Assessment

### HIGH RISK:
- Updating file references incorrectly could break website functionality
- Must test after each major change

### MEDIUM RISK:
- Moving backup files (but they're not actively used)
- Shell script path updates

### LOW RISK:
- Image reorganization (already well-structured)
- Documentation updates

## Testing Strategy

1. **After each phase**: Test website functionality
2. **Mobile testing**: Ensure mobile responsiveness remains intact
3. **Cross-browser testing**: Verify compatibility
4. **Link validation**: Check all internal links work
5. **Asset loading**: Verify all CSS, JS, and images load correctly

## Benefits of Reorganization

1. **Maintainability**: Clear file organization
2. **Development**: Easier to find and modify files
3. **Performance**: Better caching strategies possible
4. **Scalability**: Easier to add new features
5. **Team collaboration**: Clear structure for multiple developers

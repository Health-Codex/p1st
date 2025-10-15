# Website Admin Editor System

## Overview

The Admin Editor System is a comprehensive website management interface that allows authorized users to edit any page content, manage staff and providers, and configure site settings. The system is designed to be hidden from regular website visitors while providing powerful editing capabilities for administrators.

## Features

### 🎨 Page Content Editor
- **Visual Editor**: WYSIWYG editor with comprehensive formatting tools
- **HTML Editor**: Direct HTML code editing with Monaco syntax highlighting
- **CSS Editor**: Custom styling with live preview and auto-completion
- **Smart Content Extraction**: Automatically detect and edit content blocks
- **Real-time Preview**: See changes instantly in new window
- **Page Download**: Export individual pages with custom styling
- **Bulk Operations**: Apply changes across multiple pages

### 🌐 Global Site Editor
- **Find & Replace**: Search and replace text across all pages
- **Regular Expressions**: Advanced pattern matching support
- **Bulk Updates**: Update headers, footers, and templates site-wide
- **Site Validation**: Check all pages for issues and broken links
- **Image Optimization**: Optimize all images across the site
- **Change Tracking**: Monitor modifications across the entire site

### 🏗️ Template Editor
- **Shared Components**: Edit headers, footers, navigation, and reusable sections
- **Template Library**: Pre-built templates for common page elements
- **Live Preview**: See template changes before applying
- **Bulk Application**: Apply template changes to all pages instantly
- **Version Control**: Track template changes and revert if needed

### 📋 Navigation Editor
- **Visual Menu Builder**: Drag-and-drop navigation structure editing
- **Dropdown Support**: Create and manage multi-level menus
- **Icon Integration**: Add Font Awesome icons to menu items
- **Link Management**: Internal and external link configuration
- **Mobile Optimization**: Responsive navigation design

### 👥 Staff & Provider Management
- **Comprehensive Forms**: Detailed staff information with all fields
- **Photo Management**: Drag-and-drop image uploading with preview
- **Specialty Organization**: Categorize by medical specialties and roles
- **Credential Tracking**: Manage certifications and experience
- **Statistics Dashboard**: Overview of staff metrics and counts
- **Export/Import**: Backup and restore staff data

### 📁 Content & Media Manager
- **Advanced Upload**: Drag-and-drop with progress tracking
- **Media Browser**: Visual content library with search and filters
- **Image Replacement**: Replace images across entire site
- **File Organization**: Categorize and tag media files
- **Optimization Tools**: Compress and optimize images automatically
- **Usage Tracking**: See where media files are used across the site

### 🧩 Component Library
- **Pre-built Components**: Hero sections, service cards, contact forms, testimonials
- **One-click Insertion**: Add components directly to any page
- **Customization Tools**: Modify components before insertion
- **Category Organization**: Organized by component type and purpose
- **Preview System**: See components before adding to pages
- **Custom Components**: Create and save your own reusable components

### 🛡️ Backup Manager
- **Complete Backups**: Full site backups with all content and settings
- **Selective Backups**: Choose what to include (pages, images, settings, staff)
- **Restore Functionality**: One-click restore from any backup
- **Export/Import**: Download backups for external storage
- **Backup History**: Manage multiple backup versions
- **Automated Scheduling**: Set up regular backup creation

### ⚙️ Site Settings
- **Theme Customization**: Colors, fonts, and styling options
- **Contact Management**: Phone numbers, emails, and addresses
- **SEO Configuration**: Meta titles, descriptions, and keywords
- **Global Variables**: Site-wide text and configuration
- **Performance Settings**: Optimization and caching options
- **Integration Settings**: Third-party service configurations

## File Structure

```
admin-editor.html           # Main admin interface
admin-demo.html            # Demo and documentation page
provider-page.html         # Enhanced provider management page
assets/css/admin-editor.css # Admin interface styling
assets/js/admin-editor.js  # Admin functionality
```

## Access Methods

### 1. Direct Access
- Navigate to `admin-editor.html` directly
- Use the demo page at `admin-demo.html` for guided access

### 2. Hidden Access on Provider Page
The provider page includes hidden admin access for security:

**Method A: Keyboard Shortcut**
- Press `Ctrl + Shift + A` while on the provider page
- Admin button will appear in the page header

**Method B: Triple-Click**
- Triple-click on the page title "Staff Management"
- Admin button will be revealed

### 3. Security Features
- Admin controls are hidden by default
- No direct links in main navigation
- Requires specific actions to reveal admin interface
- Prevents accidental patient access

## Usage Instructions

### Getting Started
1. Open `admin-demo.html` to see the system overview
2. Click "Launch Admin Editor" to access the main interface
3. Or use hidden access methods on the provider page

### Editing Pages
1. Go to the "Page Editor" tab
2. Select a page from the dropdown
3. Click "Load Page" to begin editing
4. Choose between Visual, HTML, or CSS editors
5. Make your changes
6. Click "Save Changes" when finished

### Managing Staff
1. Use the "Staff Manager" tab for quick additions
2. Or click "Open Full Provider Manager" for comprehensive management
3. Fill out the staff information form
4. Upload photos using drag-and-drop
5. Set specialties and credentials
6. Save the new staff member

### Content Management
1. Go to the "Content Manager" tab
2. Drag files to the upload zone or click to browse
3. Manage existing content in the browser
4. Organize files by type and usage

### Site Configuration
1. Access the "Site Settings" tab
2. Modify colors, contact info, and site details
3. Save settings to apply changes globally
4. Reset to defaults if needed

## Technical Details

### Dependencies
- Monaco Editor for code editing
- Font Awesome for icons
- Modern browser with ES6+ support
- Local storage for settings persistence

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (including file:// protocol)
- Mobile browsers: Responsive design included

### Data Storage
- Settings stored in localStorage
- Provider data integrated with existing system
- Export functionality for backups
- JSON format for data interchange

## Security Considerations

### Access Control
- No direct navigation links to admin pages
- Hidden activation methods prevent accidental access
- Admin interface clearly marked and styled differently

### Data Protection
- All changes are local until explicitly saved
- Export functionality for backup purposes
- Reset options to revert unwanted changes

### User Experience
- Clear visual indicators for admin mode
- Confirmation dialogs for destructive actions
- Auto-save warnings when leaving modified content

## Customization

### Adding New Pages
1. Edit the `pages` array in `admin-editor.js`
2. Add new page entries with name and file path
3. System will automatically include them in the editor

### Extending Functionality
- Add new tabs by modifying the HTML structure
- Extend JavaScript classes for new features
- CSS variables for easy theme customization

### Integration
- Compatible with existing header system
- Works with current provider management
- Maintains website design consistency

## Troubleshooting

### Common Issues
1. **Admin button not appearing**: Ensure correct key combination (Ctrl+Shift+A)
2. **Editor not loading**: Check browser console for JavaScript errors
3. **Changes not saving**: Verify localStorage is enabled
4. **Mobile issues**: Use landscape orientation for better experience

### Browser-Specific Notes
- **Safari**: File protocol fully supported
- **Chrome**: May require local server for some features
- **Firefox**: Full compatibility with all features
- **Mobile**: Touch-friendly interface with responsive design

## Future Enhancements

### Planned Features
- User authentication system
- Role-based access control
- Version history and rollback
- Collaborative editing
- Advanced media management
- SEO optimization tools

### Integration Opportunities
- CMS integration
- Database connectivity
- Cloud storage support
- Automated backups
- Multi-site management

## Support

For technical support or feature requests, refer to the main website documentation or contact the development team.

---

**Note**: This admin system is designed for authorized personnel only. Always backup your data before making significant changes.

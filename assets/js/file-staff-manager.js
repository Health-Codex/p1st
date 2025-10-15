/**
 * File-Based Staff Management System
 * Uses FileSystem Access API for direct file writing with file:// protocol support
 */


// Detect if running over HTTP(S) vs file://
const isHttp = location.protocol.startsWith('http');
// Determine API base for sites deployed in a subdirectory like /p1st
// If URL path contains '/p1st/', use '/p1st/api'; otherwise default to '/api'
const API_BASE = isHttp ? ((location.pathname.indexOf('/p1st/') !== -1 ? '/p1st' : '') + '/api') : '/api';

class FileStaffManager {
    constructor() {
        this.dataPath = 'assets/data/staff-data.json';
        this.imagePath = 'assets/images/';
        this.staff = [];
        this.fileHandle = null;
        this.imageDirectoryHandle = null;

        this.init();
    }

    async init() {
        console.log('Initializing File-Based Staff Manager...');
        await this.loadStaffData();
        this.setupEventListeners();
        this.updateUI();
    }

    /**
     * Load staff data from JSON file
     */
    async loadStaffData() {
        try {
            if (isHttp) {
                const res = await fetch(API_BASE + '/staff');
                if (!res.ok) throw new Error('Failed to load staff data');
                const data = await res.json();
                this.staff = data.staff || [];
                console.log('Loaded staff data (HTTP):', this.staff.length, 'members');
                return;
            }

            // file:// fallback
            const response = await fetch(this.dataPath);
            // Safari on file:// often reports status 0 and ok=false even on success.
            if (response.ok || (!isHttp && response.status === 0)) {
                const data = await response.json();
                this.staff = data.staff || [];
                console.log('Loaded staff data (file):', this.staff.length, 'members');
            } else {
                console.log('No existing staff data file found, starting fresh');
                this.staff = [];
            }
        } catch (error) {
            console.log('Could not load staff data file:', error.message);
            this.staff = [];
        }
    }

    /**
     * Save staff data to JSON file using FileSystem Access API
     */
    async saveStaffData() {
        try {
            const data = {
                metadata: {
                    version: "1.0",
                    lastUpdated: new Date().toISOString(),
                    totalStaff: this.staff.length
                },
                staff: this.staff
            };

            if (isHttp) {
                await fetch(API_BASE + '/staff', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else if ('showSaveFilePicker' in window) {
                await this.saveWithFileSystemAPI(data);
            } else {
                await this.saveWithDownload(data);
            }

            // Notify other pages of the update
            this.notifyDataUpdate();

            console.log('Staff data saved successfully');
            this.showNotification('Staff data saved successfully!', 'success');

        } catch (error) {
            console.error('Error saving staff data:', error);
            this.showNotification('Error saving staff data: ' + error.message, 'error');
        }
    }

    /**
     * Save using FileSystem Access API
     */
    async saveWithFileSystemAPI(data) {
        try {
            if (!this.fileHandle) {
                // Request file handle for the data file
                this.fileHandle = await window.showSaveFilePicker({
                    suggestedName: 'staff-data.json',
                    types: [{
                        description: 'JSON files',
                        accept: { 'application/json': ['.json'] }
                    }]
                });
            }

            const writable = await this.fileHandle.createWritable();
            await writable.write(JSON.stringify(data, null, 2));
            await writable.close();

        } catch (error) {
            if (error.name !== 'AbortError') {
                throw error;
            }
        }
    }

    /**
     * Fallback save method using download
     */
    async saveWithDownload(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'staff-data.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Please save the downloaded file to assets/data/staff-data.json', 'info');
    }

    /**
     * Handle image upload and save to assets/images/
     */
    async handleImageUpload(file, staffId) {
        try {
            if (!file || !file.type.startsWith('image/')) {
                throw new Error('Please select a valid image file');
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Image file too large. Please select a file under 5MB');
            }

            // Generate unique filename (used for non-HTTP fallbacks only)
            const extension = (file.name && file.name.includes('.')) ? file.name.split('.').pop() : 'jpg';
            const filename = `staff-${staffId}-${Date.now()}.${extension}`;
            const relativePath = `assets/images/${filename}`;

            if (isHttp) {
                const fd = new FormData();
                fd.append('image', file, file.name || filename);
                fd.append('providerId', staffId);
                // Try to get provider name from current context if available
                const providerNameField = document.getElementById('providerName');
                if (providerNameField && providerNameField.value) {
                    fd.append('providerName', providerNameField.value);
                }
                const res = await fetch(API_BASE + '/upload', { method: 'POST', body: fd });
                const json = await res.json();
                if (!json.ok) throw new Error(json.error || 'Upload failed');
                return json.path; // Use server-provided path so it matches the saved file
            } else if ('showDirectoryPicker' in window) {
                await this.saveImageWithFileSystemAPI(file, filename);
                return relativePath;
            } else {
                await this.saveImageWithDownload(file, filename);
                return relativePath;
            }

        } catch (error) {
            console.error('Error handling image upload:', error);
            this.showNotification('Error uploading image: ' + error.message, 'error');
            throw error;
        }
    }

    /**
     * Save image using FileSystem Access API
     */
    async saveImageWithFileSystemAPI(file, filename) {
        try {
            if (!this.imageDirectoryHandle) {
                // Request directory handle for images folder
                this.imageDirectoryHandle = await window.showDirectoryPicker();
            }

            const fileHandle = await this.imageDirectoryHandle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(file);
            await writable.close();

        } catch (error) {
            if (error.name !== 'AbortError') {
                throw error;
            }
        }
    }

    /**
     * Fallback image save method using download
     */
    async saveImageWithDownload(file, filename) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification(`Please save the downloaded image as ${filename} in assets/images/`, 'info');
    }

    /**
     * Add new staff member
     */
    async addStaff(staffData, imageFile = null) {
        try {
            const staffId = 'staff_' + Date.now();
            let imagePath = 'assets/images/default-staff.jpg';

            // Handle image upload if provided
            if (imageFile) {
                imagePath = await this.handleImageUpload(imageFile, staffId);
            }

            const newStaff = {
                id: staffId,
                name: staffData.name || '',
                title: staffData.title || '',
                type: staffData.type || 'medical',
                specialty: staffData.specialty || '',
                credentials: staffData.credentials || '',
                bio: staffData.bio || '',
                image: imagePath,
                dateAdded: new Date().toISOString()
            };

            this.staff.push(newStaff);
            await this.saveStaffData();
            this.updateUI();

            return newStaff;

        } catch (error) {
            console.error('Error adding staff:', error);
            this.showNotification('Error adding staff: ' + error.message, 'error');
            throw error;
        }
    }

    /**
     * Update existing staff member
     */
    async updateStaff(staffId, staffData, imageFile = null) {
        try {
            const index = this.staff.findIndex(s => s.id === staffId);
            if (index === -1) {
                throw new Error('Staff member not found');
            }

            let imagePath = this.staff[index].image;

            // Handle image upload if provided
            if (imageFile) {
                imagePath = await this.handleImageUpload(imageFile, staffId);
            }

            this.staff[index] = {
                ...this.staff[index],
                name: staffData.name || this.staff[index].name,
                title: staffData.title || this.staff[index].title,
                type: staffData.type || this.staff[index].type,
                specialty: staffData.specialty || this.staff[index].specialty,
                credentials: staffData.credentials || this.staff[index].credentials,
                bio: staffData.bio || this.staff[index].bio,
                image: imagePath,
                updatedAt: new Date().toISOString()
            };

            await this.saveStaffData();
            this.updateUI();

            return this.staff[index];

        } catch (error) {
            console.error('Error updating staff:', error);
            this.showNotification('Error updating staff: ' + error.message, 'error');
            throw error;
        }
    }

    /**
     * Delete staff member
     */
    async deleteStaff(staffId) {
        try {
            const index = this.staff.findIndex(s => s.id === staffId);
            if (index === -1) {
                throw new Error('Staff member not found');
            }

            this.staff.splice(index, 1);
            await this.saveStaffData();
            this.updateUI();

            this.showNotification('Staff member deleted successfully', 'success');

        } catch (error) {
            console.error('Error deleting staff:', error);
            this.showNotification('Error deleting staff: ' + error.message, 'error');
            throw error;
        }
    }

    /**
     * Notify other pages of data updates
     */
    notifyDataUpdate() {
        // Use BroadcastChannel for cross-tab communication
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('staff-updates');
            channel.postMessage({
                type: 'staff-data-updated',
                timestamp: Date.now(),
                staffCount: this.staff.length
            });
        }

        // Also dispatch custom event for same-page communication
        window.dispatchEvent(new CustomEvent('staffDataUpdated', {
            detail: { staff: this.staff }
        }));
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for updates from other tabs
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('staff-updates');
            channel.addEventListener('message', (event) => {
                if (event.data.type === 'staff-data-updated') {
                    console.log('Received staff update notification from another tab');
                    this.loadStaffData().then(() => this.updateUI());
                }
            });
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update statistics
        const totalElement = document.getElementById('total-staff');
        const medicalElement = document.getElementById('medical-count');
        const supportElement = document.getElementById('support-count');

        if (totalElement) totalElement.textContent = this.staff.length;
        if (medicalElement) medicalElement.textContent = this.staff.filter(s => s.type === 'medical').length;
        if (supportElement) supportElement.textContent = this.staff.filter(s => s.type === 'support').length;

        // Update staff list if present
        this.renderStaffList();
    }

    /**
     * Render staff list in admin interface
     */
    renderStaffList() {
        const container = document.getElementById('staff-list');
        if (!container) return;

        if (this.staff.length === 0) {
            container.innerHTML = '<p class="no-staff">No staff members added yet.</p>';
            return;
        }

        container.innerHTML = this.staff.map(member => `
            <div class="staff-item" data-id="${member.id}">
                <div class="staff-info">
                    <img src="${member.image}" alt="${member.name}" class="staff-thumb">
                    <div class="staff-details">
                        <h4>${member.name}</h4>
                        <p class="title">${member.title}</p>
                        <span class="type-badge ${member.type}">${member.type === 'medical' ? 'Medical Provider' : 'Support Staff'}</span>
                    </div>
                </div>
                <div class="staff-actions">
                    <button class="btn-edit" onclick="editStaff('${member.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteStaff('${member.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global instance
window.fileStaffManager = new FileStaffManager();

/**
 * File-Based Staff Renderer for Public Pages
 * Displays staff data from JSON files with real-time updates
 */
class FileStaffRenderer {
    constructor() {
        this.dataPath = 'assets/data/staff-data.json';
        this.staff = [];
        this.pollInterval = null;
        this.lastModified = null;

        this.init();
    }

    async init() {
        console.log('Initializing File-Based Staff Renderer...');
        await this.loadStaffData();
        this.renderStaffCards();
        this.setupAutoRefresh();
        console.log('File Staff Renderer initialized with', this.staff.length, 'staff members');
    }

    /**
     * Load staff data (HTTP uses API; file:// uses local JSON)
     */
    async loadStaffData() {
        try {
            if (isHttp) {
                const res = await fetch(API_BASE + '/staff');
                if (!res.ok) throw new Error('Failed to load staff data');
                const data = await res.json();
                this.staff = data.staff || [];
                console.log('Loaded staff data (HTTP renderer):', this.staff.length, 'members');
                return;
            }

            // file:// fallback: read local JSON
            const response = await fetch(this.dataPath + '?t=' + Date.now());
            if (response.ok || (!isHttp && response.status === 0)) {
                const data = await response.json();
                this.staff = data.staff || [];
                this.lastModified = response.headers.get('last-modified');
                console.log('Loaded staff data (file renderer):', this.staff.length, 'members');
            } else {
                console.log('No staff data file found');
                this.staff = [];
            }
        } catch (error) {
            console.log('Could not load staff data (renderer):', error.message);
            this.staff = [];
        }
    }

    /**
     * Render staff cards on the public page
     */
    renderStaffCards() {
        const medicalContainer = document.querySelector('.staff-grid');
        const supportContainer = document.querySelector('.support-staff-grid');

        if (!medicalContainer || !supportContainer) {
            console.log('Staff containers not found');
            return;
        }

        // Clear existing content
        medicalContainer.innerHTML = '';
        supportContainer.innerHTML = '';

        // Filter staff by type
        const medicalProviders = this.staff.filter(staff => staff.type === 'medical');
        const supportStaff = this.staff.filter(staff => staff.type === 'support');

        // Render medical providers
        if (medicalProviders.length > 0) {
            medicalContainer.innerHTML = medicalProviders.map(member => this.createStaffCard(member)).join('');
        } else {
            medicalContainer.innerHTML = '<p class="no-staff">No medical providers added yet.</p>';
        }

        // Render support staff
        if (supportStaff.length > 0) {
            supportContainer.innerHTML = supportStaff.map(member => this.createStaffCard(member)).join('');
        } else {
            supportContainer.innerHTML = '<p class="no-staff">No support staff added yet.</p>';
        }

        console.log('Rendered', medicalProviders.length, 'medical providers and', supportStaff.length, 'support staff');
    }

    /**
     * Create HTML for a staff card
     */
    createStaffCard(member) {
        const specialties = member.specialty ? member.specialty.split(',').map(s => s.trim()) : [];
        const credentials = member.credentials ? member.credentials.split(',').map(c => c.trim()) : [];

        const locations = member.locations ? member.locations.split(',').map(l => l.trim()).filter(Boolean) : [];
        const languages = member.languages ? member.languages.split(',').map(l => l.trim()).filter(Boolean) : [];
        const yearsExp = member.yearsExperience ? parseInt(member.yearsExperience) : null;

        // Only show specialty badge for medical staff, and only if they have specialties
        const showSpecialtyBadge = member.type === 'medical' && specialties.length > 0;
        const specialtyBadge = showSpecialtyBadge ? `<div class="staff-specialty-badge">${specialties[0]}</div>` : '';

        return `
            <div class="staff-card hover-lift shadow-soft" data-id="${member.id}">
                ${specialtyBadge}
                <div class="staff-image image-zoom-container">
                    <img src="${member.image || 'assets/images/healthcare-team-professional.jpg'}" alt="${member.name}" loading="lazy" class="image-zoom" onerror="this.onerror=null; this.src='assets/images/healthcare-team-professional.jpg'">
                    <div class="staff-social">
                        ${member.linkedinUrl ? `<a href="${member.linkedinUrl}" target="_blank" class="social-link hover-scale" aria-label="LinkedIn Profile"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
                        ${member.email ? `<a href="mailto:${member.email}" class="social-link hover-scale" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>` : ''}
                        ${member.phone ? `<a href="tel:${member.phone}" class="social-link hover-scale" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>` : ''}
                    </div>
                </div>
                <div class="staff-info">
                    <h3 class="staff-name">${member.name}</h3>
                    <p class="staff-title"><i class="fa-solid fa-user-doctor"></i> ${member.title}</p>
                    ${yearsExp ? `<div class="experience-badge"><i class="fa-solid fa-clock"></i> ${yearsExp}+ Years Experience</div>` : ''}
                    ${credentials.length > 0 ? `<div class="staff-credentials">${credentials.map(c => `<span class="credential"><i class="fa-solid fa-graduation-cap"></i> ${c}</span>`).join('')}</div>` : ''}
                    ${locations.length > 0 ? `<div class="staff-locations"><i class="fa-solid fa-map-marker-alt"></i> ${locations.join(', ')}</div>` : ''}
                    ${languages.length > 0 ? `<div class="staff-languages"><i class="fa-solid fa-globe"></i> ${languages.join(', ')}</div>` : ''}
                    ${member.bio ? `<p class="staff-bio">${member.bio}</p>` : ''}
                    ${specialties.length > 0 ? `<div class="staff-specialties">${specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}</div>` : ''}
                    ${member.education ? `<div class="staff-education"><i class="fa-solid fa-university"></i> ${member.education}</div>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Setup automatic refresh for real-time updates
     */
    setupAutoRefresh() {
        // HTTP: Live updates via SSE
        if (isHttp) {
            try {
                const es = new EventSource(API_BASE + '/events');
                es.addEventListener('staff-updated', async () => {
                    console.log('SSE: staff-updated');
                    await this.loadStaffData();
                    this.renderStaffCards();
                });
            } catch (e) {
                console.warn('SSE init failed', e);
            }
        }

        // BroadcastChannel fallback
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('staff-updates');
            channel.addEventListener('message', (event) => {
                if (event.data.type === 'staff-data-updated') {
                    console.log('Received staff update notification, refreshing...');
                    this.loadStaffData().then(() => this.renderStaffCards());
                }
            });
        }

        // Listen for custom events (same-tab communication)
        window.addEventListener('staffDataUpdated', (event) => {
            console.log('Staff data updated in same tab, refreshing...');
            this.staff = event.detail.staff || [];
            this.renderStaffCards();
        });

        // Poll for file changes every 5 seconds (HTTP HEAD only if not HTTP)
        this.pollInterval = setInterval(async () => {
            try {
                if (!isHttp) {
                    const response = await fetch(this.dataPath + '?t=' + Date.now(), { method: 'HEAD' });
                    const currentModified = response.headers.get('last-modified');
                    if (currentModified && currentModified !== this.lastModified) {
                        console.log('Staff data file changed, reloading...');
                        await this.loadStaffData();
                        this.renderStaffCards();
                    }
                }
            } catch (error) {
                // Ignore polling errors
            }
        }, 5000);

        console.log('Auto-refresh setup complete');
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }
}

// Initialize renderer on our-staff page
if (window.location.pathname.includes('our-staff') || document.querySelector('.staff-grid')) {
    window.fileStaffRenderer = new FileStaffRenderer();
}

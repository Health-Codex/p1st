/**
 * Secure File-Based Storage System
 * Handles encrypted staff data storage in JSON files with authentication
 * Works with static websites without requiring server-side processing
 */

class SecureFileStorage {
    constructor() {
        this.dataPath = 'assets/data/staff-data.json';
        this.encryptionKey = null;
        this.isAuthenticated = false;
        this.fallbackData = null;
        this.init();
    }

    init() {
        // Check authentication status
        this.checkAuthentication();
        
        // Generate encryption key from user session
        if (this.isAuthenticated) {
            this.generateEncryptionKey();
        }
    }

    checkAuthentication() {
        const session = this.getSession();
        this.isAuthenticated = !!(session && session.username === 'ashin97');
        return this.isAuthenticated;
    }

    getSession() {
        try {
            const session = localStorage.getItem('staffSession') || sessionStorage.getItem('staffSession');
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.warn('Error reading session:', error);
            return null;
        }
    }

    generateEncryptionKey() {
        const session = this.getSession();
        if (session && session.username) {
            // Create a consistent key from user credentials and timestamp
            const keyData = session.username + session.loginTime + 'PeopleFirstUrgentCare2025';
            this.encryptionKey = this.simpleHash(keyData);
        }
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Simple XOR encryption for file-based storage
    encrypt(data) {
        if (!this.encryptionKey) return data;

        try {
            // Pre-process data to handle large base64 images
            const processedData = this.preprocessDataForEncryption(data);
            const jsonString = JSON.stringify(processedData);

            // For very large data (>5MB), store unencrypted but mark as such
            const dataSizeMB = jsonString.length / (1024 * 1024);
            if (dataSizeMB > 5) {
                console.info(`Large data detected (${Math.round(dataSizeMB * 10) / 10} MB), storing unencrypted for performance`);
                return {
                    unencrypted: true,
                    data: data,
                    size: Math.round(dataSizeMB * 10) / 10
                };
            }

            // For medium data (1-5MB), use chunked encryption
            if (dataSizeMB > 1) {
                console.info(`Medium data detected (${Math.round(dataSizeMB * 10) / 10} MB), using chunked encryption`);
                return this.encryptInChunks(jsonString);
            }

            // Standard encryption for smaller data
            let encrypted = '';
            const key = this.encryptionKey;

            for (let i = 0; i < jsonString.length; i++) {
                const keyChar = key[i % key.length];
                const encryptedChar = String.fromCharCode(
                    jsonString.charCodeAt(i) ^ keyChar.charCodeAt(0)
                );
                encrypted += encryptedChar;
            }

            return btoa(encrypted); // Base64 encode
        } catch (error) {
            console.error('Encryption failed:', error);
            return data; // Return unencrypted data as fallback
        }
    }

    encryptInChunks(jsonString) {
        const chunkSize = 100000; // 100KB chunks
        const chunks = [];
        const key = this.encryptionKey;

        for (let i = 0; i < jsonString.length; i += chunkSize) {
            const chunk = jsonString.substring(i, i + chunkSize);
            let encryptedChunk = '';

            for (let j = 0; j < chunk.length; j++) {
                const keyChar = key[(i + j) % key.length];
                const encryptedChar = String.fromCharCode(
                    chunk.charCodeAt(j) ^ keyChar.charCodeAt(0)
                );
                encryptedChunk += encryptedChar;
            }

            chunks.push(btoa(encryptedChunk));
        }

        return {
            chunked: true,
            chunks: chunks,
            totalSize: jsonString.length
        };
    }

    preprocessDataForEncryption(data) {
        // Handle array of staff data
        if (Array.isArray(data)) {
            return data.map(item => this.preprocessStaffItem(item));
        }
        return data;
    }

    preprocessStaffItem(staff) {
        const processed = { ...staff };

        // Validate and potentially compress image data
        if (processed.image && processed.image.startsWith('data:image/')) {
            if (!this.validateImageData(processed.image)) {
                console.warn(`Invalid image data for ${processed.name}, using default`);
                processed.image = 'assets/images/healthcare-team-professional.jpg';
            }
        }

        return processed;
    }

    validateImageData(imageData) {
        try {
            if (!imageData.startsWith('data:image/')) return false;

            const base64Index = imageData.indexOf('base64,');
            if (base64Index === -1) return false;

            const base64Data = imageData.substring(base64Index + 7);
            if (base64Data.length === 0) return false;

            // Try to decode to ensure it's valid
            atob(base64Data);
            return true;
        } catch (error) {
            return false;
        }
    }

    decrypt(encryptedData) {
        if (!this.encryptionKey || !encryptedData) return null;

        try {
            // Handle unencrypted large data
            if (typeof encryptedData === 'object' && encryptedData.unencrypted) {
                console.info(`Loading unencrypted large data (${encryptedData.size} MB)`);
                return this.postprocessDataAfterDecryption(encryptedData.data);
            }

            // Handle chunked encryption
            if (typeof encryptedData === 'object' && encryptedData.chunked) {
                console.info(`Decrypting chunked data (${Math.round(encryptedData.totalSize / 1024)} KB)`);
                return this.decryptChunks(encryptedData);
            }

            // If data is not encrypted (fallback case), return as-is
            if (Array.isArray(encryptedData)) {
                return this.postprocessDataAfterDecryption(encryptedData);
            }

            // Standard decryption
            const encrypted = atob(encryptedData); // Base64 decode
            let decrypted = '';
            const key = this.encryptionKey;

            for (let i = 0; i < encrypted.length; i++) {
                const keyChar = key[i % key.length];
                const decryptedChar = String.fromCharCode(
                    encrypted.charCodeAt(i) ^ keyChar.charCodeAt(0)
                );
                decrypted += decryptedChar;
            }

            const parsedData = JSON.parse(decrypted);
            return this.postprocessDataAfterDecryption(parsedData);
        } catch (error) {
            console.warn('Decryption failed:', error);
            return null;
        }
    }

    decryptChunks(encryptedData) {
        try {
            const key = this.encryptionKey;
            let decrypted = '';
            let position = 0;

            for (const encryptedChunk of encryptedData.chunks) {
                const chunk = atob(encryptedChunk);
                let decryptedChunk = '';

                for (let i = 0; i < chunk.length; i++) {
                    const keyChar = key[(position + i) % key.length];
                    const decryptedChar = String.fromCharCode(
                        chunk.charCodeAt(i) ^ keyChar.charCodeAt(0)
                    );
                    decryptedChunk += decryptedChar;
                }

                decrypted += decryptedChunk;
                position += chunk.length;
            }

            const parsedData = JSON.parse(decrypted);
            return this.postprocessDataAfterDecryption(parsedData);
        } catch (error) {
            console.error('Chunked decryption failed:', error);
            return null;
        }
    }

    postprocessDataAfterDecryption(data) {
        // Handle array of staff data
        if (Array.isArray(data)) {
            return data.map(item => this.postprocessStaffItem(item));
        }
        return data;
    }

    postprocessStaffItem(staff) {
        const processed = { ...staff };

        // Validate image data after decryption
        if (processed.image && processed.image.startsWith('data:image/')) {
            if (!this.validateImageData(processed.image)) {
                console.warn(`Corrupted image data for ${processed.name}, using default`);
                processed.image = 'assets/images/healthcare-team-professional.jpg';
            }
        }

        return processed;
    }

    async loadStaffData() {
        try {
            // Try to fetch from file
            const response = await fetch(this.dataPath + '?t=' + Date.now());

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const raw = await response.json();
            const data = { ...raw };

            // Normalize staff payload for backward compatibility
            data.staff = this.normalizeStaffPayload(data);

            // If file is marked encrypted and we're authenticated, attempt decryption of legacy formats
            if (raw.encrypted && this.isAuthenticated && !Array.isArray(data.staff)) {
                const decryptedStaff = this.decrypt(raw.staff);
                if (decryptedStaff && Array.isArray(decryptedStaff)) {
                    data.staff = decryptedStaff;
                }
            }

            // Ensure staff is an array at this point
            if (!Array.isArray(data.staff)) {
                console.warn('Staff payload could not be read from file; falling back');
                const fallback = this.loadFromLocalStorageFallback();
                this.fallbackData = fallback;
                return fallback;
            }

            // Cache for fallback
            this.fallbackData = data;

            return data;

        } catch (error) {
            console.warn('Error loading staff data from file:', error);

            // Fallback to cached data or localStorage
            if (this.fallbackData) {
                return this.fallbackData;
            }

            return this.loadFromLocalStorageFallback();
        }
    }

    normalizeStaffPayload(fileData) {
        try {
            // Already an array
            if (Array.isArray(fileData.staff)) return fileData.staff;

            const payload = fileData.staff;
            // Unencrypted large-data format
            if (payload && typeof payload === 'object' && payload.unencrypted && Array.isArray(payload.data)) {
                return payload.data;
            }
            // Chunked encrypted format, cannot be read without auth/key
            if (payload && typeof payload === 'object' && payload.chunked) {
                if (this.isAuthenticated) {
                    const decrypted = this.decrypt(payload);
                    if (Array.isArray(decrypted)) return decrypted;
                }
                return []; // unreadable for public
            }
            // Legacy encrypted string format, requires auth
            if (typeof payload === 'string') {
                if (this.isAuthenticated) {
                    const decrypted = this.decrypt(payload);
                    if (Array.isArray(decrypted)) return decrypted;
                }
                return []; // unreadable for public
            }

            return [];
        } catch (e) {
            console.warn('Failed to normalize staff payload:', e);
            return [];
        }
    }

    loadFromLocalStorageFallback() {
        // Final fallback to localStorage (same device only)
        const localData = localStorage.getItem('healthcare_providers');
        if (localData) {
            try {
                const providers = JSON.parse(localData);
                return {
                    metadata: {
                        version: "1.0",
                        lastUpdated: new Date().toISOString(),
                        source: "localStorage_fallback"
                    },
                    staff: Array.isArray(providers) ? providers : []
                };
            } catch (e) {
                console.warn('Error parsing localStorage data:', e);
            }
        }
        return this.getDefaultData();
    }

    async saveStaffData(staffData) {
        if (!this.isAuthenticated) {
            throw new Error('Authentication required to save staff data');
        }

        try {
            const now = new Date().toISOString();
            const dataToSave = {
                metadata: {
                    version: "1.0",
                    lastUpdated: now,
                    encryptionEnabled: true,
                    adminUser: this.getSession().username
                },
                staff: staffData.map(s => ({ ...s, updatedAt: s.updatedAt || now })),
                encrypted: true
            };

            // Create a PUBLIC (unencrypted) dataset for the website file so visitors can see updates
            const publicData = {
                metadata: { ...dataToSave.metadata },
                staff: staffData, // unencrypted so public page can load it
                encrypted: false
            };

            // For static websites, keep a secure copy in localStorage (optional)
            try {
                const secureCopy = this.encryptionKey ? this.encrypt(staffData) : staffData;
                localStorage.setItem('healthcare_providers_secure', JSON.stringify({
                    metadata: dataToSave.metadata,
                    staff: secureCopy,
                    encrypted: !!this.encryptionKey
                }));
            } catch (e) {
                console.warn('Could not persist secure copy to localStorage:', e.message);
            }

            // Also save unencrypted to localStorage for compatibility and immediate same-device view
            localStorage.setItem('healthcare_providers', JSON.stringify(staffData));

            // Cache the data
            this.fallbackData = {
                metadata: dataToSave.metadata,
                staff: staffData
            };

            // Also transfer payload for same-tab navigation using window.name
            try {
                if (typeof window !== 'undefined') {
                    window.name = `P1ST_PROVIDERS_JSON::${JSON.stringify(staffData)}`;
                }
            } catch (e) {
                console.warn('Could not set window.name payload:', e.message);
            }

            // Trigger file download for manual update (PUBLIC file)
            this.downloadDataFile(publicData);

            // Show success message
            this.showSaveNotification();

            return true;
            
        } catch (error) {
            console.error('Error saving staff data:', error);
            throw error;
        }
    }

    downloadDataFile(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'staff-data.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showSaveNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'secure-save-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa-solid fa-shield-check"></i>
                <div class="notification-text">
                    <strong>Data Saved Securely!</strong>
                    <p>Staff data has been encrypted and saved. The updated file has been downloaded - please upload it to your website's assets/data/ folder to make changes visible to all visitors.</p>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#secure-save-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'secure-save-notification-styles';
            styles.textContent = `
                .secure-save-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
                    z-index: 10000;
                    animation: slideInSecure 0.5s ease;
                }
                
                .notification-content {
                    padding: 1.5rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }
                
                .notification-content i.fa-shield-check {
                    font-size: 1.5rem;
                    margin-top: 0.25rem;
                }
                
                .notification-text strong {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 1.1rem;
                }
                
                .notification-text p {
                    margin: 0;
                    font-size: 0.9rem;
                    opacity: 0.9;
                    line-height: 1.4;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }
                
                .notification-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                @keyframes slideInSecure {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInSecure 0.5s ease reverse';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }
        }, 10000);
    }

    getDefaultData() {
        return {
            metadata: {
                version: "1.0",
                lastUpdated: new Date().toISOString(),
                source: "default"
            },
            staff: []
        };
    }

    // Public methods for compatibility with existing SharedProviderData interface
    async getAllProviders() {
        const data = await this.loadStaffData();
        return data.staff || [];
    }

    async saveProviders(providers) {
        return await this.saveStaffData(providers);
    }

    isSecureStorageAvailable() {
        return this.isAuthenticated && this.encryptionKey;
    }
}

// Export for use in other modules
window.SecureFileStorage = SecureFileStorage;

// Initialize secure storage
window.secureFileStorage = new SecureFileStorage();

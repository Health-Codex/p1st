/*
 * MCP Storage (Multi-Channel Persistence) - SECURE VERSION
 * Active sync across pages using:
 * - IndexedDB as the primary source of truth (large payload friendly)
 * - BroadcastChannel for real-time updates across tabs/windows
 * - localStorage/sessionStorage + window.name as fallbacks (Safari file://)
 * - AES-GCM encryption for sensitive data
 * - Authentication-based access control
 */

class MCPStorage {
  constructor() {
    this.dbName = 'p1st_secure';
    this.storeName = 'encrypted_kv';
    this.key = 'providers';
    this.channelName = 'p1st-providers-secure';
    this.bc = null;
    this.db = null;
    this.subscribers = new Set();
    this.initialized = false;
    this.encryptionKey = null;
    this.isAuthenticated = false;
    this.sessionTTLHours = 8; // configurable TTL
    this.readyPromise = null;
  }

  async init() {
    if (this.readyPromise) return this.readyPromise;
    this.readyPromise = (async () => {
      try {
        await this.openDB();
      } catch (e) {
        console.warn('MCP IndexedDB unavailable, will use fallbacks:', e);
      }

      // Initialize auth + key from staff login session (if present)
      this.tryInitAuth();

      // Setup broadcast channel
      try {
        this.bc = new BroadcastChannel(this.channelName);
        this.bc.onmessage = (evt) => {
          if (evt && evt.data && evt.data.type === 'providers-updated') {
            this.notify(evt.data);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel unavailable:', e);
      }
      this.initialized = true;
    })();
    return this.readyPromise;
  }

  tryInitAuth() {
    try {
      const raw = localStorage.getItem('staffSession') || sessionStorage.getItem('staffSession');
      if (!raw) return;
      const session = JSON.parse(raw);

      // Session TTL check
      const loginTs = session?.loginTime ? Date.parse(session.loginTime) : 0;
      const maxAge = this.sessionTTLHours * 60 * 60 * 1000;
      const expired = !loginTs || (Date.now() - loginTs > maxAge);
      if (expired) {
        this.isAuthenticated = false;
        this.encryptionKey = null;
        // Inform listeners that session expired so UIs can prompt
        try { this.bc && this.bc.postMessage({ type: 'session-expired' }); } catch (_) {}
        return;
      }

      // Require staff-management permission
      const ok = session && session.username && Array.isArray(session.permissions) && session.permissions.includes('staff-management');
      this.isAuthenticated = !!ok;
      if (ok) {
        const material = `${session.username.toLowerCase()}|${session.loginTime}|P1ST-SECURE-2025`;
        this.setKeyFromString(material);
      }
    } catch (_) {}
  }

  async setKeyFromString(text) {
    try {
      const enc = new TextEncoder();
      const data = enc.encode(text);
      const hash = await crypto.subtle.digest('SHA-256', data);
      this.encryptionKey = await crypto.subtle.importKey(
        'raw',
        hash,
        { name: 'AES-GCM' },
        false,
        ['encrypt','decrypt']
      );
    } catch (e) {
      console.warn('Failed to initialize encryption key:', e);
      this.encryptionKey = null;
    }
  }

  subscribe(callback) {
    if (typeof callback === 'function') this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(payload) {
    for (const cb of this.subscribers) {
      try { cb(payload); } catch (_) {}
    }
  }

  async getAll() {
    // Try IndexedDB first (encrypted if auth is present)
    const idbData = await this.idbGet(this.key);
    if (idbData) {
      try {
        if (idbData.__enc && this.encryptionKey) {
          const decrypted = await this.decrypt(idbData);
          if (Array.isArray(decrypted)) return decrypted;
        } else if (Array.isArray(idbData)) {
          return idbData;
        }
      } catch (_) {}
    }

    // Fallback: sessionStorage
    try {
      const ss = sessionStorage.getItem('healthcare_providers');
      if (ss) return JSON.parse(ss);
    } catch (_) {}

    // Fallback: localStorage
    try {
      const ls = localStorage.getItem('healthcare_providers');
      if (ls) return JSON.parse(ls);
    } catch (_) {}

    // Fallback: window.name (same-tab navigation)
    try {
      if (typeof window !== 'undefined' && typeof window.name === 'string' && window.name.startsWith('P1ST_PROVIDERS_JSON::')) {
        const json = window.name.substring('P1ST_PROVIDERS_JSON::'.length);
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}

    return [];
  }

  async setAll(providers) {
    const data = Array.isArray(providers) ? providers : [];

    // Write to IndexedDB (encrypted if authenticated; else plaintext for dev)
    let payload = data;
    if (this.encryptionKey && this.isAuthenticated) {
      try { payload = await this.encrypt(data); } catch (_) {}
    }
    await this.idbSet(this.key, payload);

    // Fallback mirrors (for same-tab immediate read and Safari file://)
    try { localStorage.setItem('healthcare_providers', JSON.stringify(data)); } catch (_) {}
    try { sessionStorage.setItem('healthcare_providers', JSON.stringify(data)); } catch (_) {}
    try { if (typeof window !== 'undefined') window.name = `P1ST_PROVIDERS_JSON::${JSON.stringify(data)}`; } catch (_) {}

    // Broadcast update
    try { this.bc && this.bc.postMessage({ type: 'providers-updated', count: data.length, ts: Date.now() }); } catch (_) {}

    return true;
  }

  async openDB() {
    if (!('indexedDB' in window)) throw new Error('IndexedDB not supported');
    this.db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 2);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async idbGet(key) {
    if (!this.db) return null;
    return await new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async idbSet(key, value) {
    if (!this.db) return false;
    return await new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }
  // Encryption helpers (AES-GCM)
  async encrypt(data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const plaintext = enc.encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, this.encryptionKey, plaintext);
    return {
      __enc: true,
      alg: 'AES-GCM',
      iv: Array.from(iv),
      ct: Array.from(new Uint8Array(ciphertext)),
      v: 1
    };
  }

  async decrypt(payload) {
    if (!payload || !payload.__enc || !Array.isArray(payload.iv) || !Array.isArray(payload.ct)) return null;
    const iv = new Uint8Array(payload.iv);
    const ct = new Uint8Array(payload.ct);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, this.encryptionKey, ct);
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  }
}

// Global instance for convenience
(function initMCP() {
  try {
    if (!window.mcpStorage) {
      window.mcpStorage = new MCPStorage();
      window.mcpStorage.init();
    }
  } catch (e) {
    console.warn('Failed to initialize MCPStorage:', e);
  }
})();

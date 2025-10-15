/*
People First Urgent Care - Staff Login System
Secure authentication for healthcare professionals
*/

class StaffLoginSystem {
    constructor() {
        this.loginAttempts = 0;
        this.maxAttempts = 3;
        this.lockoutTime = 5 * 60 * 1000; // 5 minutes

        // User credentials database (case-insensitive usernames)
        this.users = {
            'ashin97': {
                password: 'Chester3428!',
                type: 'provider-admin',
                name: 'Admin User',
                permissions: ['admin', 'provider', 'staff-management']
            },
            'demo_scribe': {
                password: 'demo123',
                type: 'scribe',
                name: 'Demo Scribe',
                permissions: ['scribe', 'documentation']
            }
            // Additional users can be added here
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLockoutStatus();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Password toggle
        const passwordToggle = document.getElementById('passwordToggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }

        // Form submission
        const loginForm = document.getElementById('staffLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Demo login button
        const demoScribeBtn = document.getElementById('demoScribeBtn');
        if (demoScribeBtn) {
            demoScribeBtn.addEventListener('click', () => this.fillDemoCredentials());
        }

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const loginBtn = document.getElementById('loginBtn');
                if (loginBtn && !loginBtn.disabled) {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    }

    fillDemoCredentials() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (usernameInput && passwordInput) {
            usernameInput.value = 'demo_scribe';
            passwordInput.value = 'demo123';

            // Add visual feedback
            usernameInput.style.background = 'rgba(5, 166, 92, 0.1)';
            passwordInput.style.background = 'rgba(5, 166, 92, 0.1)';

            setTimeout(() => {
                usernameInput.style.background = '';
                passwordInput.style.background = '';
            }, 1000);
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#passwordToggle i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fa-solid fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fa-solid fa-eye';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isLockedOut()) {
            this.showError('Account temporarily locked. Please try again later.');
            return;
        }

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!username || !password) {
            this.showError('Please enter both username and password.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        // Simulate authentication delay for security
        await this.delay(1500);

        // Authenticate user
        const authResult = this.authenticateUser(username, password);
        
        if (authResult.success) {
            this.handleSuccessfulLogin(authResult.user, rememberMe);
        } else {
            this.handleFailedLogin(authResult.message);
        }
    }

    authenticateUser(username, password) {
        // Make username case-insensitive
        const normalizedUsername = username.toLowerCase();
        const user = this.users[normalizedUsername];

        if (!user) {
            return { success: false, message: 'Invalid username or password.' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Invalid username or password.' };
        }

        return { success: true, user: user };
    }

    handleSuccessfulLogin(user, rememberMe) {
        // Reset login attempts
        this.loginAttempts = 0;
        localStorage.removeItem('loginLockout');

        // Store session data
        const sessionData = {
            username: Object.keys(this.users).find(key => this.users[key] === user),
            userType: user.type,
            name: user.name,
            permissions: user.permissions,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        if (rememberMe) {
            localStorage.setItem('staffSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('staffSession', JSON.stringify(sessionData));
        }

        // Show success animation
        this.showSuccessModal();

        // Redirect after delay
        setTimeout(() => {
            this.redirectToPortal(user.type);
        }, 2000);
    }

    handleFailedLogin(message) {
        this.setLoadingState(false);
        this.loginAttempts++;
        
        if (this.loginAttempts >= this.maxAttempts) {
            this.lockAccount();
            message = `Too many failed attempts. Account locked for ${this.lockoutTime / 60000} minutes.`;
        }

        this.showError(message);
        this.shakeForm();
    }

    redirectToPortal(userType) {
        // Redirect to Employee Portal instead of provider page
        window.location.href = 'employee-portal.html';
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorElement && errorText) {
            errorText.textContent = message;
            errorElement.style.display = 'flex';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    setLoadingState(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const form = document.getElementById('staffLoginForm');
        
        if (loginBtn) {
            loginBtn.disabled = loading;
            if (loading) {
                loginBtn.classList.add('loading');
            } else {
                loginBtn.classList.remove('loading');
            }
        }

        if (form) {
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.disabled = loading;
            });
        }
    }

    shakeForm() {
        const formContainer = document.querySelector('.login-form-container');
        if (formContainer) {
            formContainer.style.animation = 'none';
            setTimeout(() => {
                formContainer.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
        }
    }

    lockAccount() {
        const lockoutData = {
            timestamp: Date.now(),
            attempts: this.loginAttempts
        };
        localStorage.setItem('loginLockout', JSON.stringify(lockoutData));
    }

    isLockedOut() {
        const lockoutData = localStorage.getItem('loginLockout');
        if (!lockoutData) return false;

        const { timestamp } = JSON.parse(lockoutData);
        const timePassed = Date.now() - timestamp;
        
        if (timePassed >= this.lockoutTime) {
            localStorage.removeItem('loginLockout');
            this.loginAttempts = 0;
            return false;
        }

        return true;
    }

    checkLockoutStatus() {
        if (this.isLockedOut()) {
            const lockoutData = JSON.parse(localStorage.getItem('loginLockout'));
            const timeRemaining = this.lockoutTime - (Date.now() - lockoutData.timestamp);
            const minutesRemaining = Math.ceil(timeRemaining / 60000);
            
            this.showError(`Account locked. Try again in ${minutesRemaining} minute(s).`);
            this.setLoadingState(true);
            
            // Auto-unlock when time expires
            setTimeout(() => {
                localStorage.removeItem('loginLockout');
                this.loginAttempts = 0;
                this.setLoadingState(false);
                location.reload();
            }, timeRemaining);
        }
    }

    setupAnimations() {
        // Add staggered animation to form elements
        const formElements = document.querySelectorAll('.form-group, .form-options, .login-btn');
        formElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the login system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StaffLoginSystem();
});

// Session management utilities
window.StaffAuth = {
    isLoggedIn: function() {
        const session = localStorage.getItem('staffSession') || sessionStorage.getItem('staffSession');
        return !!session;
    },
    
    getSession: function() {
        const session = localStorage.getItem('staffSession') || sessionStorage.getItem('staffSession');
        return session ? JSON.parse(session) : null;
    },
    
    logout: function() {
        localStorage.removeItem('staffSession');
        sessionStorage.removeItem('staffSession');
        window.location.href = 'staff-login.html';
    },
    
    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'staff-login.html';
            return false;
        }
        return true;
    }
};

// public/js/main.js
// DOM Elements
const userButton = document.getElementById('userButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const logoutButton = document.getElementById('logoutButton');

// Event Listeners
userButton?.addEventListener('click', () => dropdownMenu?.classList.toggle('show'));
window.addEventListener('click', (e) => {
    if (userButton && !userButton.contains(e.target)) {
        dropdownMenu?.classList.remove('show');
    }
});
logoutButton?.addEventListener('click', handleLogout);

// Logout function
async function handleLogout() {
    try {
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'same-origin'
        });
        
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Password toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget.querySelector('i');
    
    if (!input || !icon) return;
    
    input.type = input.type === 'password' ? 'text' : 'password';
    icon.classList.toggle('fa-eye', input.type === 'text');
    icon.classList.toggle('fa-eye-slash', input.type === 'password');
}

// Theme toggle
document.getElementById('themeToggle')?.addEventListener('change', async (e) => {
    const isDark = e.target.checked;
    document.body.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('dark-theme', isDark);
    
    try {
        await fetch('/api/auth/theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ darkMode: isDark })
        });
    } catch (error) {
        console.error('Failed to save theme preference:', error);
    }
});

// Load theme on page load
async function loadTheme() {
    try {
        const response = await fetch('/api/auth/theme');
        const { darkMode } = await response.json();
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = darkMode;
        }
        document.body.classList.toggle('dark-theme', darkMode);
        document.documentElement.classList.toggle('dark-theme', darkMode);
    } catch (error) {
        console.error('Failed to load theme preference:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadTheme);
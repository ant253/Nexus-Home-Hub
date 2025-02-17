// public/js/main.js
// Toggle dropdown menu
const userButton = document.getElementById('userButton');
const dropdownMenu = document.getElementById('dropdownMenu');

userButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
});

// Close dropdown when clicking outside
window.addEventListener('click', (e) => {
    if (!userButton.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', async () => {
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // Server-side logout call
    await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
    });

    // Redirect to login page
    window.location.href = '/login.html';
});
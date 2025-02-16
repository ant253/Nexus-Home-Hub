// utils/users.js
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'users.json');

const loadUsers = () => {
    if (fs.existsSync(USERS_FILE)) {
        try {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }
    return [];
};

const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Make sure users.json exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
}

module.exports = { loadUsers, saveUsers };
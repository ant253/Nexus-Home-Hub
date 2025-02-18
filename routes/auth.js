// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loadUsers, saveUsers } = require('../utils/users');

const router = express.Router();

// Register route (initial setup)
router.post('/register', (req, res) => {
  const users = loadUsers();
  if (users.length > 0) {
    return res.status(403).send({ message: 'Admin account already exists' });
  }
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword });
  saveUsers(users);
  res.status(201).send({ message: 'Admin account created successfully' });
});

// Login route
router.post('/login', (req, res) => {
  const users = loadUsers();
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).send({ message: 'Login successful' });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Add new logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.status(200).send({ message: 'Logged out successfully' });
});

// Add these new routes to the existing router
router.post('/change-password', (req, res) => {
    const users = loadUsers();
    const { currentPassword, newPassword } = req.body;
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, 'secret');
        const user = users.find(u => u.username === decoded.username);

        if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = bcrypt.hashSync(newPassword, 8);
        saveUsers(users);
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

router.post('/change-username', (req, res) => {
    const users = loadUsers();
    const { newUsername } = req.body;
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, 'secret');
        const user = users.find(u => u.username === decoded.username);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if new username already exists
        if (users.some(u => u.username === newUsername)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Update username
        user.username = newUsername;
        saveUsers(users);

        // Create new token with new username
        const newToken = jwt.sign({ username: newUsername }, 'secret', { expiresIn: '1h' });
        res.cookie('token', newToken, { httpOnly: true });
        
        res.json({ message: 'Username changed successfully' });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

// Add to existing router
router.post('/theme', (req, res) => {
    const { darkMode } = req.body;
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, 'secret');
        const users = loadUsers();
        const user = users.find(u => u.username === decoded.username);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Save theme preference
        user.darkMode = darkMode;
        saveUsers(users);
        
        res.json({ message: 'Theme preference saved' });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

router.get('/theme', (req, res) => {
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, 'secret');
        const users = loadUsers();
        const user = users.find(u => u.username === decoded.username);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({ darkMode: user.darkMode || false });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

module.exports = router;
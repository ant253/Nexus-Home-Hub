// filepath: server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Load users from file
const loadUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
  }
  return [];
};

// Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Middleware to check if user is authenticated
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login.html');
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect('/login.html');
  }
};

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Serve the initial setup page if no users exist
app.get('/', (req, res) => {
  const users = loadUsers();
  if (users.length === 0) {
    return res.redirect('/setup.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { loadUsers, saveUsers };
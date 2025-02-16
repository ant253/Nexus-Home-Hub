// filepath: routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const users = []; // In-memory user storage

// Register route (initial setup)
router.post('/register', (req, res) => {
  if (users.length > 0) {
    return res.status(403).send({ message: 'Admin account already exists' });
  }
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword });
  res.status(201).send({ message: 'Admin account created successfully' });
});

// Login route
router.post('/login', (req, res) => {
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

module.exports = router;
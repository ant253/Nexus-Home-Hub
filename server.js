// filepath: server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const { loadUsers } = require('./utils/users');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Root route handler
app.get('/', (req, res) => {
    const users = loadUsers();
    
    if (users.length === 0) {
        return res.redirect('/setup.html');
    }
    
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login.html');
    }
    
    try {
        jwt.verify(token, 'secret');
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
        res.redirect('/login.html');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
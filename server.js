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

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Root route handler - Must be before static files
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
        const decoded = jwt.verify(token, 'secret');
        if (!decoded) {
            throw new Error('Invalid token');
        }
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
        res.clearCookie('token', { path: '/' });
        res.redirect('/login.html');
    }
});

// Protect direct access to dashboard
app.get('/index.html', (req, res) => {
    res.redirect('/');
});

// Static files middleware - After route handlers
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
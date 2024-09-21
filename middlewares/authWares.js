// const UserModel = require('../models/Users')
const jwt = require('jsonwebtoken')

// Middleware to verify user and decode JWT token
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ error: 'The token is missing' });
    }

    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'The token is wrong' });
        }

        req.email = decoded.email;
        req.name = decoded.name;
        req.role = decoded.role;
        next();
    });
};

// Middleware to check if the user is a superadmin
const isSuperAdmin = (req, res, next) => {
    const superAdminEmail = 'kumarakash91384@gmail.com';
    if (req.email !== superAdminEmail) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};



module.exports = {verifyUser, isSuperAdmin}
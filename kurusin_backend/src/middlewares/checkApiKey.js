const jwt = require('jsonwebtoken');
const { User } = require('../models');

const checkApiKey = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) 
            return res.status(401).json({ message: 'Access token is required.' });
        
        let token = authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        const user = await User.findOne({ username: decoded.username });
        if (!user) 
            return res.status(401).json({ message: 'User not found!' });
        
        req.user = {
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            saldo: decoded.saldo,
            subscription: decoded.subscription,
            apiQuota: decoded.apiQuota
        };

        next();
    } catch (error) {
        console.log('Token verification error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Error verifying token',
                error: error.message
            });
        }
    }
};

module.exports = checkApiKey;
const jwt = require('jsonwebtoken');
const { User, Apilog } = require('../models');

const checkApiKey = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token is required. Please provide a valid JWT token in Authorization header.' 
            });
        }

        let token;
        
        // Handle both "Bearer token" and direct token formats
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            // If no "Bearer " prefix, treat the whole header as token
            token = authHeader;
        }        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        
        // Check if user still exists
        const user = await User.findOne({ username: decoded.username }).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }        // Add user data to request object
        req.user = {
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            saldo: decoded.saldo,
            subscription: decoded.subscription,
            apiQuota: decoded.apiQuota
        };

        // Save API log
        try {
            await Apilog.create({
                apiKey: decoded.username, // Using username as identifier since we're using JWT
                endpoint: req.originalUrl || req.url,
                method: req.method,
                timestamp: new Date(),
                statusCode: null, // Will be updated in response
                userAgent: req.headers['user-agent'] || '',
                ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                    (req.connection.socket ? req.connection.socket.remoteAddress : null)
            });
        } catch (logError) {
            // Don't fail the request if logging fails, just log the error
            console.log('API logging error:', logError.message);
        }

        next();
    } catch (error) {
        console.log('Token verification error:', error.message); // Debug log
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
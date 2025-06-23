const { Apilog } = require('../models');
const jwt = require('jsonwebtoken');

const updateApiLog = (req, res, next) => {
    res.on('finish', async () => {
        let username = 'anonymous';
        
        try {
            // Try to get username from authenticated user first (from checkApiKey middleware)
            if (req.user && req.user.username) {
                username = req.user.username;
            }
            // If no authenticated user, try to get from JWT token manually
            else if (req.headers.authorization) {
                try {
                    let token = req.headers.authorization;
                    if (token.startsWith('Bearer ')) token = token.substring(7);
                    
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
                    if (decoded.username) {
                        username = decoded.username;
                    }
                } catch (jwtError) {
                    // Token invalid, continue with other methods
                }
            }
            // If still no username, try to get from login request body
            else if (req.method === 'POST' && req.originalUrl.includes('/login') && req.body && req.body.username) {
                username = req.body.username;
            }
            
            const log = new Apilog({
                username: username,
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                userAgent: req.get('User-Agent'),
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            });
        
            await log.save();
        } catch (error) {
            console.error('Error saving API log:', error);
        }
    });
  
    next();
};

module.exports = updateApiLog;

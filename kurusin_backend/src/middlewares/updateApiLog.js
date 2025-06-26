const { Apilog } = require('../models');
const jwt = require('jsonwebtoken');

const updateApiLog = (req, res, next) => {
    res.on('finish', async () => {
        let username = 'anonymous';
        
        try {
            if (req.user && req.user.username) {
                username = req.user.username;
            }
            else if (req.headers.authorization) {
                try {
                    let token = req.headers.authorization;
                    if (token.startsWith('Bearer ')) token = token.substring(7);
                    
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
                    if (decoded.username) {
                        username = decoded.username;
                    }
                } catch (jwtError) {
                }
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

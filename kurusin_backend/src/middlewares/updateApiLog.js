const { Apilog } = require('../models');

const updateApiLog = (req, res, next) => {
    res.on('finish', async () => {
        const log = new Apilog({
            username: req.user?.username || 'anonymous',
            endpoint: req.originalUrl,
            method: req.method,
            statusCode: res.statusCode,
            userAgent: req.get('User-Agent'),
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });
    
        await log.save();
    });
  
    next();
};

module.exports = updateApiLog;

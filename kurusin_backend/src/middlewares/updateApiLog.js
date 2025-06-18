const { Apilog } = require('../models');

const updateApiLog = async (req, res, next) => {
    // Store original send method
    const originalSend = res.send;
    
    // Override res.send to capture status code
    res.send = function(data) {
        // Update the most recent API log for this user with the status code
        if (req.user && req.user.username) {
            Apilog.findOneAndUpdate(
                { 
                    apiKey: req.user.username,
                    endpoint: req.originalUrl || req.url,
                    method: req.method,
                    statusCode: null
                },
                { statusCode: res.statusCode },
                { sort: { timestamp: -1 } }
            ).catch(error => {
                console.log('Error updating API log status code:', error.message);
            });
        }
        
        // Call original send method
        return originalSend.call(this, data);
    };
    
    next();
};

module.exports = updateApiLog;

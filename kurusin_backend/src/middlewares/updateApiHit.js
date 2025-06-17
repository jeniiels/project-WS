const ApiTier = require('../models/ApiTier');
const ApiLog = require('../models/ApiLog');

const updateApiHit = async (req, res, next) => {
    const startTime = Date.now();
    
    // Override res.json to capture response and log after response is sent
    const originalJson = res.json;
    
    res.json = function(data) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Log the API hit asynchronously (don't block response)
        setImmediate(async () => {
            try {
                const { username } = req.query;
                
                if (username && req.userTier) {
                    // Update API hit count
                    await ApiTier.findByIdAndUpdate(
                        req.userTier._id,
                        { $inc: { api_hits_used: 1 } }
                    );

                    // Log API usage
                    await ApiLog.create({
                        username,
                        endpoint: req.originalUrl,
                        method: req.method,
                        status_code: res.statusCode,
                        response_time: responseTime
                    });
                }
            } catch (error) {
                console.error('Error updating API hit:', error);
            }
        });
        
        // Call original json method
        return originalJson.call(this, data);
    };
    
    next();
};

module.exports = updateApiHit;

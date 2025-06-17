const ApiTier = require('../models/ApiTier');

const checkSubscription = async (req, res, next) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({ 
                message: 'Username is required' 
            });
        }

        // Find user's API tier information
        let userTier = await ApiTier.findOne({ username });
        
        // If user doesn't exist, create a free tier account
        if (!userTier) {
            userTier = await ApiTier.create({
                username,
                tier: 'free',
                api_hits_used: 0,
                max_api_hits: 100
            });
        }

        // Check if subscription is still active
        if (!userTier.is_active || new Date() > userTier.subscription_end) {
            return res.status(403).json({ 
                message: 'Subscription expired. Please renew your subscription.' 
            });
        }

        // Check if user has exceeded API limit
        if (userTier.api_hits_used >= userTier.max_api_hits) {
            return res.status(429).json({ 
                message: 'API limit exceeded. Please upgrade your subscription or wait for reset.' 
            });
        }

        // Add user tier info to request for use in other middlewares
        req.userTier = userTier;
        
        next();
    } catch (error) {
        console.error('Check subscription error:', error);
        return res.status(500).json({ 
            message: 'Internal server error during subscription check' 
        });
    }
};

module.exports = checkSubscription;

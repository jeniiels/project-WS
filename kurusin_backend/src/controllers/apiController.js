const ApiLog = require('../models/ApiLog');
const ApiTier = require('../models/ApiTier');
const Joi = require('joi');

// GET /api/logs/:username
const getUserLogs = async (req, res) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 50, start_date, end_date } = req.query;
        
        // Build query filter
        const filter = { username };
        
        if (start_date || end_date) {
            filter.timestamp = {};
            if (start_date) filter.timestamp.$gte = new Date(start_date);
            if (end_date) filter.timestamp.$lte = new Date(end_date);
        }
        
        const logs = await ApiLog.find(filter)
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            
        const total = await ApiLog.countDocuments(filter);
        
        return res.status(200).json({
            logs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching user logs:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /api/subscribe
const subscribe = async (req, res) => {
    try {
        const subscribeSchema = Joi.object({
            username: Joi.string().min(3).max(50).required(),
            tier: Joi.string().valid('free', 'premium').required(),
            duration_days: Joi.number().min(1).max(365).default(30)
        });
        
        const { error, value } = subscribeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.details[0].message 
            });
        }
        
        const { username, tier, duration_days } = value;
        
        // Calculate subscription end date
        const subscriptionEnd = new Date();
        subscriptionEnd.setDate(subscriptionEnd.getDate() + duration_days);
        
        // Set max API hits based on tier
        const maxApiHits = tier === 'premium' ? 10000 : 100;
        
        // Update or create subscription
        const subscription = await ApiTier.findOneAndUpdate(
            { username },
            {
                username,
                tier,
                max_api_hits: maxApiHits,
                subscription_start: new Date(),
                subscription_end: subscriptionEnd,
                is_active: true,
                api_hits_used: 0 // Reset on new subscription
            },
            { 
                upsert: true, 
                new: true 
            }
        );
        
        return res.status(200).json({
            message: 'Subscription updated successfully',
            subscription: {
                username: subscription.username,
                tier: subscription.tier,
                max_api_hits: subscription.max_api_hits,
                subscription_end: subscription.subscription_end,
                is_active: subscription.is_active
            }
        });
    } catch (error) {
        console.error('Error updating subscription:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUserLogs,
    subscribe
};

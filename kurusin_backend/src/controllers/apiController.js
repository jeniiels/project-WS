const { Apilog, User, Apitier } = require("../models");

// Helper function to get API quota for subscription tier
const getApiQuotaForTier = async (subscriptionTier) => {
    try {
        const tier = await Apitier.findOne({ name: subscriptionTier });
        return tier ? tier.monthlyQuota : 0;
    } catch (error) {
        // Default quotas if Apitier collection is not populated
        const defaultQuotas = {
            'free': 100,
            'basic': 1000,
            'premium': 10000
        };
        return defaultQuotas[subscriptionTier] || 0;
    }
};

// GET /api/logs/:username
const getLogs = async (req, res) => {
    try {
        const { username } = req.params;
        
        // Check if the authenticated user is trying to access their own logs or has admin role
        if (req.user.username !== username && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only view your own logs or need admin privileges."
            });
        }
        
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Get API logs for the specific user using apiKey field (which stores username)
        const logs = await Apilog.find({ apiKey: username })
                                  .sort({ timestamp: -1 })
                                  .limit(100);
        
        res.json({
            success: true,
            message: `Successfully retrieved API logs for user: ${username}`,
            data: logs,
            totalLogs: logs.length,
            username: username
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving API logs",
            error: error.message
        });
    }
};

// POST /api/subscribe
const subscribe = async (req, res) => {
    try {
        const { tier } = req.body;
        
        // Use authenticated user's username instead of from request body
        const username = req.user.username;
        
        // Validate required fields
        if (!tier) {
            return res.status(400).json({
                success: false,
                message: "Tier is required"
            });
        }
        
        // Validate tier options
        const validTiers = ['free', 'basic', 'premium'];
        if (!validTiers.includes(tier.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Invalid tier. Valid tiers are: free, basic, premium"
            });
        }
        
        // Check if user exists (should exist since authenticated)
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Get API quota for the new tier
        const newApiQuota = await getApiQuotaForTier(tier.toLowerCase());
        
        // Update user subscription and API quota
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { 
                subscription: tier.toLowerCase(),
                subscriptionDate: new Date(),
                apiQuota: newApiQuota
            },
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json({
            success: true,
            message: `Successfully subscribed user to ${tier} tier`,
            data: {
                username: updatedUser.username,
                name: updatedUser.name,
                subscription: updatedUser.subscription,
                subscriptionDate: updatedUser.subscriptionDate,
                apiQuota: updatedUser.apiQuota,
                saldo: updatedUser.saldo
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating subscription",
            error: error.message
        });
    }
};

module.exports = {
    getLogs,
    subscribe
};
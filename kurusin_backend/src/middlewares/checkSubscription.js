const checkSubscription = (...allowedTiers) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User authentication required. Please use checkApiKey middleware first.'
                });
            }

            if (!req.user.subscription) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User subscription information not found.'
                });
            }

            if (!allowedTiers || allowedTiers.length === 0) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error: No subscription tiers specified in middleware configuration.'
                });
            }

            const normalizedAllowedTiers = allowedTiers.map(tier => tier.toLowerCase());
            const userTier = req.user.subscription.toLowerCase();

            if (!normalizedAllowedTiers.includes(userTier)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied: This feature requires ${allowedTiers.join(' or ')} subscription. Your current subscription: ${req.user.subscription}`,
                    details: {
                        requiredTiers: allowedTiers,
                        currentTier: req.user.subscription,
                        upgradeRequired: true
                    }
                });
            }

            req.subscriptionInfo = {
                currentTier: req.user.subscription,
                allowedTiers: allowedTiers,
                apiQuota: req.user.apiQuota || 0,
                hasAccess: true
            };

            console.log(`Subscription check passed for user: ${req.user.username}, tier: ${req.user.subscription}`);

            next();
        } catch (error) {
            console.error('Error in checkSubscription middleware:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while checking subscription',
                error: error.message
            });
        }
    };
};

module.exports = checkSubscription;
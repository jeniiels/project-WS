const tierHierarchy = {
    'free': 1,
    'basic': 2,
    'premium': 3
};

const checkSubscription = (minimumRequiredTier) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User authentication required. Please use checkApiKey middleware first.'
                });
            }

            const userTierName = req.user.subscription.toLowerCase();
            const userLevel = tierHierarchy[userTierName];

            if (!userLevel) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied: Your subscription tier "${req.user.subscription}" is not recognized.`
                });
            }

            if (userLevel < requiredLevel) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied: This feature requires a "${minimumRequiredTier}" subscription or higher.`,
                    details: {
                        requiredTier: minimumRequiredTier,
                        currentTier: req.user.subscription,
                        upgradeRequired: true
                    }
                });
            }

            req.subscriptionInfo = {
                currentTier: req.user.subscription,
                requiredTier: minimumRequiredTier,
                hasAccess: true
            };

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
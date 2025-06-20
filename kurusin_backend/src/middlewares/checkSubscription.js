const checkSubscription = (...allowedTier) => {
    return (req, res, next) => {
        const user = req.user; 
        if (!user || !user.subscription) return res.status(401).json({ message: 'Unauthorized: subscription not found!' });
        if (!allowedTier.includes(user.subscription)) return res.status(403).json({ message: 'Forbidden: insufficient subscription tier!' });
        next();
    };
}

module.exports = checkSubscription;
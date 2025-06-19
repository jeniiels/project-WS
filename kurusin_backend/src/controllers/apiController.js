const { Apilog, User } = require("../models");
const getApiQuotaForTier = require("../utils/helper/getApiQuotaforTier");

// GET /api/logs/:username
const getLogs = async (req, res) => {
    try {
        const { username } = req.params;
        const logs = await Apilog.find({ apiKey: username }).sort({ timestamp: -1 }).limit(100);
        return res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/subscribe
const subscribe = async (req, res) => {
    try {
        const { tier } = req.body;
        const username = req.user.username;

        if (!tier) return res.status(400).json({ message: "Tier is required!" });
        
        const validTiers = ['free', 'basic', 'premium'];
        if (!validTiers.includes(tier.toLowerCase()))  return res.status(400).json({ message: "Tier is invalid!" });

        const newApiQuota = await getApiQuotaForTier(tier.toLowerCase());
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { 
                subscription: tier.toLowerCase(),
                subscriptionDate: new Date(),
                apiQuota: newApiQuota
            },
            { new: true, runValidators: true }
        ).select('-password');
        
        return res.status(200).json({
            success: true,
            message: `Successfully subscribed user to ${tier} tier!`,
            data: {
                username: updatedUser.username,
                name: updatedUser.name,
                subscription: updatedUser.subscription,
                subscriptionDate: updatedUser.subscriptionDate,
                apiQuota: updatedUser.apiQuota,
                saldo: updatedUser.saldo
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getLogs,
    subscribe
};
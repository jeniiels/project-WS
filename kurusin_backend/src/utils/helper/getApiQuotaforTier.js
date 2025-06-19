const Apitier = require("../../models");

const getApiQuotaForTier = async (subscriptionTier) => {
    try {
        const tier = await Apitier.findOne({ name: subscriptionTier });
        return tier ? tier.monthlyQuota : 0;
    } catch (error) {
        const defaultQuotas = {
            'free': 100,
            'basic': 1000,
            'premium': 10000
        };
        return defaultQuotas[subscriptionTier] || 0;
    }
};

module.exports = getApiQuotaForTier;
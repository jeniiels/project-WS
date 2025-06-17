const checkApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required' });
    }

    const validApiKey = process.env.API_KEY || 'defaultapikey';

    if (apiKey !== validApiKey) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
};

module.exports = checkApiKey;
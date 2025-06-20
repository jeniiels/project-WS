const { User } = require("../models");

const updateApiHit = async (req, res, next) => {
    res.on('finish', async () => {
        try {
            if (res.statusCode < 400 && req.user?.username) {
                await User.updateOne(
                    { username: req.user.username },
                    { $inc: { apiQuota: -1 } }
                );
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    });
    next();
};

module.exports = updateApiHit;
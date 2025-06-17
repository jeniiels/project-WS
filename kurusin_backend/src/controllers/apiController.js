// GET /api/logs/:username
const getLogs = async (req, res) => {
    res.json({
        success: true,
        message: "This is GET /api/logs/:username endpoint",
        username: req.params.username
    });
};

// POST /api/subscribe
const subscribe = async (req, res) => {
    res.json({
        success: true,
        message: "This is POST /api/subscribe endpoint"
    });
};

module.exports = {
    getLogs,
    subscribe
};
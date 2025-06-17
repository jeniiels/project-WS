const express = require('express');
const router = express.Router();

const { getUserLogs, subscribe } = require('../controllers/apiController');
const checkSubscription = require('../middlewares/checkSubscription');
const updateApiHit = require('../middlewares/updateApiHit');

// GET /api/logs/:username
router.get('/logs/:username', checkSubscription, updateApiHit, getUserLogs);

// POST /api/subscribe
router.post('/subscribe', subscribe);

module.exports = router;

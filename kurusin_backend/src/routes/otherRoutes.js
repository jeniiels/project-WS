const express = require('express');
const { login, register } = require('../controllers/userController');
const { getLogs, subscribe } = require('../controllers/apiController');
const { getDiary, scan, perform, fetchExercise, fetchRecommendation, calculateCalory } = require('../controllers/otherController');
const checkApiKey = require('../middlewares/checkApiKey');
const updateApiLog = require('../middlewares/updateApiLog');
const uploadScan = require('../utils/multer/uploadScan');
const router = express.Router();

// Public routes (no authentication required)
router.post('/login', login);
router.post('/register', register);

// Protected routes (authentication required)
router.get('/logs/:username', checkApiKey, updateApiLog, getLogs);
router.post('/subscribe', checkApiKey, updateApiLog, subscribe);
router.get('/diary/:username', checkApiKey, updateApiLog, getDiary);
router.post('/scan', checkApiKey, updateApiLog, uploadScan.single('imageFile'), scan);
router.post('/perform', checkApiKey, updateApiLog, perform);

// Public routes (no authentication required - external API fetches)
router.get('/fetch', fetchExercise);
router.get('/recommendation', checkApiKey, updateApiLog, fetchRecommendation);
router.get('/calory', calculateCalory);

module.exports = router;
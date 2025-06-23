const express = require('express');
const { login, register } = require('../controllers/userController');
const { getLogs, getAllLogs, subscribe, addSaldo } = require('../controllers/apiController');
const { getDiary, scan, perform, fetchExercise, getDailyMotivation, fetchRecommendation, calculateCalorie, getLastWorkout } = require('../controllers/otherController');
const checkApiKey = require('../middlewares/checkApiKey');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const uploadScan = require('../utils/multer/uploadScan');
const router = express.Router();

router.use(updateApiLog);

// Public routes (no authentication required, logged but no API hit tracking)
router.post('/login', login);
router.post('/register', register);

// Apply updateApiHit to protected routes only
router.use(updateApiHit);

// Protected routes (authentication required)
router.get('/logs/:username', checkApiKey, getLogs);
router.get('/logs', checkApiKey, getAllLogs);
router.post('/subscribe', checkApiKey, subscribe);
router.post('/saldo', checkApiKey, addSaldo);
router.get('/diary/:username', checkApiKey, getDiary);
router.post('/scan', checkApiKey, uploadScan.single('imageFile'), scan);
router.post('/perform', checkApiKey, perform);

// Public routes (no authentication required - external API fetches)
router.get('/fetch', fetchExercise);
router.get('/motivation', getDailyMotivation);
router.get('/recommendation', checkApiKey, fetchRecommendation);
router.get('/calorie', calculateCalorie);
router.get('/lastworkout/:username', checkApiKey, getLastWorkout);

// MDP routes
router.get('/mdp/motivation', getDailyMotivation);
router.get('/mdp/recommendation/:username', checkApiKey, fetchRecommendation);
router.get('/mdp/calorie', calculateCalorie);
router.get('/mdp/lastworkout/:username', checkApiKey, getLastWorkout);
router.get('/mdp/diary/:username', checkApiKey, getDiary);
router.post('/mdp/scan', checkApiKey, uploadScan.single('imageFile'), scan);
router.post('/mdp/perform', checkApiKey, perform);

module.exports = router;
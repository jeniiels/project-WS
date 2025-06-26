const express = require('express');
const { login, register } = require('../controllers/userController');
const { getLogs, subscribe } = require('../controllers/apiController');
const { getDiary, scan, eat, perform, fetchExercise, getDailyMotivation, fetchRecommendation, calculateCalorie, getLastWorkout } = require('../controllers/otherController');
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
router.get('/fetch', checkApiKey, updateApiLog, fetchExercise);
router.get('/motivation', checkApiKey, updateApiLog, getDailyMotivation);
router.get('/recommendation', checkApiKey, updateApiLog, fetchRecommendation);
router.get('/calorie', checkApiKey, updateApiLog, calculateCalorie);
router.get('/lastworkout', checkApiKey, updateApiLog, getLastWorkout);
router.post('/eat', checkApiKey, updateApiLog, eat);

router.get('/mdp/motivation', getDailyMotivation);
router.get('/mdp/recommendation/:username', fetchRecommendation);
router.get('/mdp/calorie/:username', calculateCalorie);
router.get('/mdp/lastworkout/:username', getLastWorkout);
router.get('/mdp/diary/:username', getDiary);
router.post('/mdp/scan/:username', uploadScan.single('imageFile'), scan);
router.post('/mdp/perform', perform);
router.post('/mdp/eat/:username', eat);

module.exports = router;
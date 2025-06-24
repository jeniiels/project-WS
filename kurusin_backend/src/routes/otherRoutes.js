const express = require('express');
const { login, register } = require('../controllers/userController');
const { getLogs, getAllLogs, subscribe, addSaldo } = require('../controllers/apiController');
const { getDiary, scan, perform, fetchExercise, getDailyMotivation, fetchRecommendation, calculateCalorie, getLastWorkout } = require('../controllers/otherController');
const checkApiKey = require('../middlewares/checkApiKey');
const checkSubscription = require('../middlewares/checkSubscription');
const checkRoles = require('../middlewares/checkRoles');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const uploadScan = require('../utils/multer/uploadScan');
const router = express.Router();

router.use(updateApiLog);

router.post('/login', login);
router.post('/register', register);

router.use(updateApiHit);

router.get('/logs/:username', checkApiKey, checkRoles('admin'), getLogs); // Admin only
router.get('/logs', checkApiKey, checkRoles('admin'), getAllLogs); // Admin only
router.post('/subscribe', checkApiKey, subscribe);
router.post('/saldo', checkApiKey, addSaldo);
router.get('/diary/:username', checkApiKey, checkSubscription('basic'), getDiary);
router.post('/scan', checkApiKey, checkSubscription('premium'), uploadScan.single('imageFile'), scan);
router.post('/perform', checkApiKey, checkSubscription('premium'), perform);

router.get('/fetch', checkApiKey, checkSubscription('basic'), fetchExercise);
router.get('/motivation', checkApiKey, checkSubscription('premium'), getDailyMotivation);
router.get('/recommendation', checkApiKey, checkSubscription('premium'), fetchRecommendation);
router.get('/calorie', checkApiKey, checkSubscription('basic'), calculateCalorie);
router.get('/lastworkout/:username', checkApiKey, checkSubscription('basic'), getLastWorkout);

// MDP routes
router.get('/mdp/motivation', checkApiKey, checkSubscription('premium'), getDailyMotivation);
router.get('/mdp/recommendation/:username', checkApiKey, checkSubscription('premium'), fetchRecommendation);
router.get('/mdp/calorie', checkApiKey, checkSubscription('basic'), calculateCalorie);
router.get('/mdp/lastworkout/:username', checkApiKey, checkSubscription('basic'), getLastWorkout);
router.get('/mdp/diary/:username', checkApiKey, checkSubscription('basic'), getDiary);
router.post('/mdp/scan', checkApiKey, checkSubscription('premium'), uploadScan.single('imageFile'), scan);
router.post('/mdp/perform', checkApiKey, checkSubscription('premium'), perform);

module.exports = router;
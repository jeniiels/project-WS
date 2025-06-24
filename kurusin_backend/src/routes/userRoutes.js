const express = require('express');
const { getAll, getOne, create, pp, update, remove, login, register } = require('../controllers/userController');
const uploadUser = require('../utils/multer/uploadUser');
const checkApiKey = require('../middlewares/checkApiKey');
const checkSubscription = require('../middlewares/checkSubscription');
const checkRoles = require('../middlewares/checkRoles');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const router = express.Router();

// Register endpoint - no authentication and no logging required
router.post('/', create); // Register

// Login endpoint - logged but no API hit tracking
router.post('/login', updateApiLog, login);
router.post('/register', updateApiLog, register);

// Apply updateApiLog and updateApiHit to all other routes
router.use(updateApiLog);
router.use(updateApiHit);

// Protected routes (require authentication) - accessible by all tiers (Free, Basic, Premium)
router.get('/', checkApiKey, checkSubscription('free'), getAll);
router.get('/:username', checkApiKey, checkSubscription('free'), getOne);
router.post('/upload', checkApiKey, checkSubscription('free'), uploadUser.single("profile"), pp);
router.put('/:username', checkApiKey, checkRoles("admin"), checkSubscription('free'), update);
router.delete('/:username', checkApiKey, checkRoles("admin"), checkSubscription('free'), remove);

// MDP routes - accessible by all tiers (Free, Basic, Premium)
router.get('/mdp/:username', checkApiKey, checkSubscription('free'), getOne);
router.post('/mdp/login', login);
router.post('/mdp/register', register);

module.exports = router;

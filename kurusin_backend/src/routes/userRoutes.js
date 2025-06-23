const express = require('express');
const { getAll, getOne, create, pp, update, remove, login, register } = require('../controllers/userController');
const uploadUser = require('../utils/multer/uploadUser');
const checkApiKey = require('../middlewares/checkApiKey');
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

// Protected routes (require authentication)
router.get('/', checkApiKey, getAll);
router.get('/:username', checkApiKey, getOne);
router.post('/upload', checkApiKey, uploadUser.single("profile"), pp);
router.put('/:username', checkApiKey, checkRoles("admin"), update);
router.delete('/:username', checkApiKey, checkRoles("admin"), remove);

// MDP routes 
router.get('/mdp/:username', checkApiKey, getOne);
router.post('/mdp/login', login);
router.post('/mdp/register', register);

module.exports = router;

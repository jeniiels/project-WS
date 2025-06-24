const express = require('express');
const { getAll, getOne, create, pp, update, remove, login, register } = require('../controllers/userController');
const uploadUser = require('../utils/multer/uploadUser');
const checkApiKey = require('../middlewares/checkApiKey');
const checkSubscription = require('../middlewares/checkSubscription');
const checkRoles = require('../middlewares/checkRoles');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const router = express.Router();

router.post('/', create); // Register

router.post('/login', login);
router.post('/register', register);

router.use(updateApiLog);
router.use(updateApiHit);

router.get('/', checkApiKey, checkSubscription('free'), getAll);
router.get('/:username', checkApiKey, checkSubscription('free'), getOne);
router.post('/upload', checkApiKey, checkSubscription('free'), uploadUser.single("profile"), pp);
router.put('/:username', checkApiKey, checkRoles("admin"), checkSubscription('free'), update); // admin only
router.delete('/:username', checkApiKey, checkRoles("admin"), checkSubscription('free'), remove); // admin only

router.get('/mdp/:username', checkApiKey, checkSubscription('free'), getOne);
router.post('/mdp/login', login);
router.post('/mdp/register', register);

module.exports = router;

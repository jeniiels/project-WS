const express = require('express');
const { getAll, getOne, create, pp, update, remove, login, register } = require('../controllers/userController');
const uploadUser = require('../utils/multer/uploadUser');
const checkApiKey = require('../middlewares/checkApiKey');
const checkRoles = require('../middlewares/checkRoles');
const updateApiLog = require('../middlewares/updateApiLog');
const router = express.Router();

router.use(updateApiLog);

router.get('/', getAll);
router.get('/:username', getOne);
router.post('/', create);
router.post('/upload', checkApiKey, uploadUser.single("profile"), pp);
router.put('/:username', checkApiKey, checkRoles("admin"), update);
router.delete('/:username', checkApiKey, checkRoles("admin"), remove);
router.post('/login', login);
router.post('/register', register);

router.get('/mdp/:username', getOne);
router.post('/mdp/login', login);
router.post('/mdp/register', register);

module.exports = router;

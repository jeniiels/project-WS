const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/foodController');
const checkApiKey = require('../middlewares/checkApiKey');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const checkRoles = require('../middlewares/checkRoles');

router.use(updateApiLog);
router.use(updateApiHit);

router.get('/', checkApiKey, getAll);
router.get('/mdp/', getAll);
router.get('/:id', checkApiKey, getOne);
router.get('/mdp/:id', getOne);
router.post('/', create);
router.put('/:id', checkApiKey, checkRolesoles("admin"), update);
router.delete('/:id', checkApiKey, checkRoles("admin"), remove);

module.exports = router;
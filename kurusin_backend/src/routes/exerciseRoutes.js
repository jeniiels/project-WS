const express = require('express');
const { getAll, getOne, getOneWithHistory, create, update, remove } = require('../controllers/exerciseController');
const checkApiKey = require('../middlewares/checkApiKey');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const router = express.Router();

router.use(updateApiLog);
router.use(updateApiHit);

// All exercise routes require authentication
router.get('/', checkApiKey, getAll);
router.get('/mdp/', checkApiKey, getAll);
router.get('/mdp/:id_exercise/:username', checkApiKey, getOneWithHistory); 
router.get('/:id_exercise', checkApiKey, getOne);
router.post('/', checkApiKey, create);
router.put('/:id', checkApiKey, update);
router.delete('/:id', checkApiKey, remove)

module.exports = router;

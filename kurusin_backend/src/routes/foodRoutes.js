const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/foodController');
const checkApiKey = require('../middlewares/checkApiKey');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');

router.use(updateApiLog);
router.use(updateApiHit);

// All food routes require authentication
router.get('/', checkApiKey, getAll);
router.get('/mdp/', checkApiKey, getAll);
router.get('/:id', checkApiKey, getOne);
router.get('/mdp/:id', checkApiKey, getOne);
router.post('/', checkApiKey, create);
router.put('/:id', checkApiKey, update);
router.delete('/:id', checkApiKey, remove);

module.exports = router;
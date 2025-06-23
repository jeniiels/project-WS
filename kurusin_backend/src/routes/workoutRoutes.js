const express = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/workoutController');
const checkApiKey = require('../middlewares/checkApiKey');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const router = express.Router();

router.use(updateApiLog);
router.use(updateApiHit);

// All workout routes require authentication
router.get('/', checkApiKey, getAll);
router.get('/:id', checkApiKey, getOne);
router.post('/', checkApiKey, create);
router.put('/:id', checkApiKey, update);
router.delete('/:id', checkApiKey, remove);

module.exports = router;

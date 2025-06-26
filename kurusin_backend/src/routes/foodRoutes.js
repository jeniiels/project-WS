const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/foodController');
const checkApiKey = require('../middlewares/checkApiKey');
const checkSubscription = require('../middlewares/checkSubscription');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');

router.use(updateApiLog);
router.use(updateApiHit);

router.get('/', checkApiKey, getAll);
router.get('/mdp/', getAll);
router.get('/:id', checkApiKey, getOne);
router.get('/mdp/:id', getOne);

// POST/PUT/DELETE routes - accessible by Basic & Premium only
router.post('/', checkApiKey, checkSubscription('basic'), create);
router.put('/:id', checkApiKey, checkSubscription('basic'), update);
router.delete('/:id', checkApiKey, checkSubscription('basic'), remove);

module.exports = router;
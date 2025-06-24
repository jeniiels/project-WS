const express = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/workoutController');
const checkApiKey = require('../middlewares/checkApiKey');
const checkSubscription = require('../middlewares/checkSubscription');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const router = express.Router();

router.use(updateApiLog);
router.use(updateApiHit);

// GET routes - accessible by all tiers (Free, Basic, Premium)
router.get('/', checkApiKey, getAll);
router.get('/:id', checkApiKey, getOne);

// POST/PUT/DELETE routes - accessible by Basic & Premium only
router.post('/', checkApiKey, checkSubscription('basic'), create);
router.put('/:id', checkApiKey, checkSubscription('basic'), update);
router.delete('/:id', checkApiKey, checkSubscription('basic'), remove);

module.exports = router;

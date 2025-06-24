const express = require('express');
const { getAll, getOne, getOneWithHistory, create, update, remove } = require('../controllers/exerciseController');
const checkApiKey = require('../middlewares/checkApiKey');
const checkSubscription = require('../middlewares/checkSubscription');
const updateApiLog = require('../middlewares/updateApiLog');
const updateApiHit = require('../middlewares/updateApiHit');
const router = express.Router();

router.use(updateApiLog);
router.use(updateApiHit);

router.get('/', checkApiKey, getAll);
router.get('/mdp/', checkApiKey, getAll);
router.get('/mdp/:id_exercise/:username', checkApiKey, getOneWithHistory); 
router.get('/:id_exercise', checkApiKey, getOne);

// POST/PUT/DELETE routes - accessible by Basic & Premium only
router.post('/', checkApiKey, checkSubscription('basic'), create);
router.put('/:id', checkApiKey, checkSubscription('basic'), update);
router.delete('/:id', checkApiKey, checkSubscription('basic'), remove);

module.exports = router;

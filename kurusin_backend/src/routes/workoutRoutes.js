const express = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/workoutController');
const checkApiKey = require('../middlewares/checkApiKey');
const updateApiLog = require('../middlewares/updateApiLog');
const router = express.Router();

router.use(checkApiKey);
router.use(updateApiLog);

router.get('/', getAll);
router.get('/:id', getOne); 
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;

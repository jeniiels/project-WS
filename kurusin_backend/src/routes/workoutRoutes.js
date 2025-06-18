const express = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/workoutController');
const checkApiKey = require('../middlewares/checkApiKey');
const router = express.Router();

// Apply checkApiKey middleware to all workout routes
router.use(checkApiKey);

router.get('/', getAll);
router.get('/:id', getOne); 
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;

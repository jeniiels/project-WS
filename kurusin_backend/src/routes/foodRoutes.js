const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/foodController');

router.get('/', getAll);
router.get('/mdp/', getAll);
router.get('/:id', getOne);
router.get('/mdp/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
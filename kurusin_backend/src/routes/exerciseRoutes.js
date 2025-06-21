const express = require('express');
const { getAll, getOne, getOneWithHistory, create, update, remove } = require('../controllers/exerciseController');
const router = express.Router();

router.get('/', getAll);
router.get('/mdp/', getAll);
router.get('/mdp/:id_exercise/:username', getOneWithHistory); 
router.get('/:id_exercise', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove)

module.exports = router;

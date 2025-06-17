const express = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAll);
router.get('/:username', getOne);
router.post('/', create);
router.put('/:username', update);
router.delete('/:username', remove);

module.exports = router;

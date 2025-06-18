const express = require('express');
const { getAll, getOne, create, update, remove, login, register } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAll);
router.get('/:username', getOne);
router.post('/', create);
router.put('/:username', update);
router.delete('/:username', remove);
router.post('/login', login);
router.post('/register', register);

module.exports = router;

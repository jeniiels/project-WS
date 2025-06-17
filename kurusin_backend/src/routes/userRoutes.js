const express = require('express');
const router = express.Router();

const { getAllUsers, register, login } = require('../controllers/userController');

router.get('/', getAllUsers);          // GET /api/users
router.post('/', register);           // POST /api/users
router.post('/login', login);         // POST /api/users/login

module.exports = router;

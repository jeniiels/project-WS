const express = require('express');
const { login, register } = require('../controllers/userController');
const { getLogs, subscribe } = require('../controllers/apiController');
const { getDiary, scan, fetchExercise, fetchRecommendation, fetchCalory } = require('../controllers/otherController');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.get('/logs/:username', getLogs);
router.post('/subscribe', subscribe);

router.get('/diary', getDiary);
router.post('/scan', scan);
router.get('/fetch', fetchExercise);
router.get('/recomendation', fetchRecommendation);
router.get('/calories', fetchCalory);

module.exports = router;
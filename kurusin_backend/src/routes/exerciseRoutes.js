const express = require('express');
const router = express.Router();

const { fetchExercises, detailExercise } = require('../controllers/exerciseController');
router.get('/', fetchExercises);
router.get('/:id_exercise', detailExercise);

module.exports = router;

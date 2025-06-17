const express = require('express');
const router = express.Router();

const { saveWorkout, lastWorkout } = require('../controllers/workoutController');
router.post('/', saveWorkout);
router.get('/:id_exercise', lastWorkout);

module.exports = router;

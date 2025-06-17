const express = require('express');
const router = express.Router();

const { 
    getAllWorkouts, 
    getWorkoutById, 
    createWorkout, 
    updateWorkout, 
    deleteWorkout,
    saveWorkout, 
    lastWorkout 
} = require('../controllers/workoutController');

// CRUD Operations
router.get('/', getAllWorkouts);          // GET /api/workouts
router.get('/:id', getWorkoutById);       // GET /api/workouts/:id
router.post('/', createWorkout);          // POST /api/workouts
router.put('/:id', updateWorkout);        // PUT /api/workouts/:id
router.delete('/:id', deleteWorkout);     // DELETE /api/workouts/:id

// Legacy endpoints (keeping for backward compatibility)
router.post('/save', saveWorkout);
router.get('/last/:id_exercise', lastWorkout);

module.exports = router;

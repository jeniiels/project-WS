const { Exercise, Workout, WorkoutHistory } = require("../models");
const createWorkoutSchema = require("../utils/joi/createWorkoutSchema");
const calculateHeaviestSet = require("../utils/helper/calculateHeaviestSet");
const calculateBestVolume = require("../utils/helper/calculateBestVolume");
const generateWorkoutId = require("../utils/helper/generateWorkoutId");

// GET /api/workouts
const getAll = async (req, res) => {
    try {
        const workouts = await Workout.find().select('-_id -createdAt -updatedAt').sort({ id: 1 });
        return res.status(200).json(workouts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// GET /api/workouts/:id 
const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await Workout.findOne({ id }).select('-_id -createdAt -updatedAt');
        
        if (!workout) 
            return res.status(404).json({ message: "Workout not found!" });
        
        return res.status(200).json(workout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/workouts
const create = async (req, res) => {
    try {
        const workoutData = req.body;

        try {
            await createWorkoutSchema.validateAsync(workoutData);
        } catch (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const id = await generateWorkoutId();
        const calculatedWorkout = workoutData.exercises.map((exercise) => {
            const heaviestSet = calculateHeaviestSet(exercise.sets);
            const bestVolume = calculateBestVolume(exercise.sets);
            return {
                id_exercise: exercise.id_exercise,
                heaviest_weight: heaviestSet,
                best_set_volume: bestVolume,
            };
        });

        workoutData.exercises = calculatedWorkout;
        const newWorkout = new Workout({ ...workoutData, id });
        const savedWorkout = await newWorkout.save();
        
        return res.status(201).json(savedWorkout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/workouts/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const workoutData = req.body;
        if (workoutData.exercises) {
            const calculatedWorkout = workoutData.exercises.map((exercise) => {
                const heaviestSet = calculateHeaviestSet(exercise.sets);
                const bestVolume = calculateBestVolume(exercise.sets);
                console.log(`Heaviest Set: ${heaviestSet}, Best Volume: ${bestVolume}`);
                return {
                    id_exercise: exercise.id_exercise,
                    heaviest_weight: heaviestSet,
                    best_set_volume: bestVolume,
                };
            });
            workoutData.exercises = calculatedWorkout;
        }
        
        const updatedWorkout = await Workout.findOneAndUpdate(
            { 
                id 
            },
            workoutData, 
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        if (!updatedWorkout) 
            return res.status(404).json({ message: "Workout not found!" });
        
        return res.status(200).json(updatedWorkout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/workouts/:id
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWorkout = await Workout.findOneAndDelete({ id });
        
        if (!deletedWorkout) 
            return res.status(404).json({ message: "Workout not found!" });
        
        return res.status(200).json({
            message: "Workout deleted successfully!",
            workout: deletedWorkout
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
}
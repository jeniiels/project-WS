const { Workout, User } = require("../models");
const createWorkoutSchema = require("../utils/joi/createWorkoutSchema");

// GET /api/workouts
const getAll = async (req, res) => {
    try {
        const workouts = await Workout.find({ username: req.user.username });
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
        const workout = await Workout.findOne({ _id: id });
        
        if (!workout) return res.status(404).json({ message: "Workout not found!" });
        
        return res.status(200).json(workout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/workouts
const create = async (req, res) => {
    try {
        const workoutData = {
            ...req.body,
            username: req.user.username
        };

        try {
            await createWorkoutSchema.validateAsync(workoutData);
        } catch (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newWorkout = new Workout(value);
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

        const workoutData = {
            ...req.body,
            username: req.user.username
        };

        try {
            await createWorkoutSchema.validateAsync(workoutData);
        } catch (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, username: req.user.username },
            value, 
            { new: true, runValidators: true }
        );
        
        if (!updatedWorkout) return res.status(404).json({ message: "Workout not found!" });
        
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
        const deletedWorkout = await Workout.findOneAndDelete({ 
            _id: id, 
            username: req.user.username 
        });
        
        if (!deletedWorkout) return res.status(404).json({ message: "Workout not found!" });
        
        return res.status(200).json(deletedWorkout);
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
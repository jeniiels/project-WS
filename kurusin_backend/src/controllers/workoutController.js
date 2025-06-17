const Workout = require("../models/Workout");
const Joi = require('joi');

// GET /api/workouts
const getAllWorkouts = async (req, res) => {
    try {
        const { username, page = 1, limit = 10 } = req.query;
        
        const filter = username ? { username } : {};
        
        const workouts = await Workout.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            
        const total = await Workout.countDocuments(filter);
        
        return res.status(200).json({
            workouts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching workouts:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// GET /api/workouts/:id
const getWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const workout = await Workout.findById(id);
        
        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }
        
        return res.status(200).json(workout);
    } catch (error) {
        console.error("Error fetching workout:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// POST /api/workouts
const createWorkout = async (req, res) => {
    try {
        const workoutSchema = Joi.object({
            username: Joi.string().required(),
            time: Joi.string().required(),
            duration: Joi.string().required(),
            exercises: Joi.array().items(
                Joi.object({
                    id_exercise: Joi.string().required(),
                    sets: Joi.array().items(Joi.string()).required()
                })
            ).required()
        });
        
        const { error, value } = workoutSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.details[0].message 
            });
        }
        
        const workout = await Workout.create(value);
        
        return res.status(201).json({
            message: "Workout created successfully",
            workout
        });
    } catch (error) {
        console.error("Error creating workout:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// PUT /api/workouts/:id
const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
          const workoutSchema = Joi.object({
            username: Joi.string(),
            time: Joi.string(),
            duration: Joi.string(),
            exercises: Joi.array().items(
                Joi.object({
                    id_exercise: Joi.string().required(),
                    sets: Joi.array().items(Joi.string()).required()
                })
            )
        });
        
        const { error, value } = workoutSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.details[0].message 
            });
        }
        
        const workout = await Workout.findByIdAndUpdate(
            id,
            value,
            { new: true, runValidators: true }
        );
        
        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }
        
        return res.status(200).json({
            message: "Workout updated successfully",
            workout
        });
    } catch (error) {
        console.error("Error updating workout:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        
        const workout = await Workout.findByIdAndDelete(id);
        
        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }
        
        return res.status(200).json({ 
            message: "Workout deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting workout:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Existing functions (legacy - for backward compatibility)
const saveWorkout = async (req, res) => {
    const { username } = req.query;
    const { time, duration, exercises } = req.body;
    const workout = {
        username,
        time,
        duration,
        exercises
    };
    await Workout.create(workout);
};

const lastWorkout = async (req, res) => {
    const { id_exercise } = req.params;
    const { username } = req.query;

    try {
        const workout = await Workout.findOne({ username, "exercises.id_exercise": id_exercise })
            .sort({ time: -1 }) // Sort by time in descending order
            .limit(1); // Get the last workout

        if (!workout) {
            return res.status(404).json({ message: "No workout found for this exercise." });
        }

        return res.status(200).json(workout);
    } catch (error) {
        console.error("Error fetching last workout:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    getAllWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    saveWorkout,
    lastWorkout
}
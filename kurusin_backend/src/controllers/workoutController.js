const { Workout } = require("../models");
const createWorkoutSchema = require("../utils/joi/createWorkoutSchema");

// GET /api/workouts
const getAll = async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json({
            success: true,
            message: "Successfully retrieved all workouts",
            data: workouts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving workouts",
            error: error.message
        });
    }
};

// GET /api/workouts/:id
const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await Workout.findById(id);
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: "Workout not found"
            });
        }
        
        res.json({
            success: true,
            message: "Successfully retrieved workout",
            data: workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving workout",
            error: error.message
        });
    }
};

// POST /api/workouts
const create = async (req, res) => {
    try {
        // Validate input using Joi schema
        const { error, value } = createWorkoutSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details[0].message
            });
        }
        
        // Create new workout
        const newWorkout = new Workout(value);
        const savedWorkout = await newWorkout.save();
        
        res.status(201).json({
            success: true,
            message: "Successfully created workout",
            data: savedWorkout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating workout",
            error: error.message
        });
    }
};

// PUT /api/workouts/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate input using Joi schema
        const { error, value } = createWorkoutSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details[0].message
            });
        }
        
        // Update workout by ID
        const updatedWorkout = await Workout.findByIdAndUpdate(
            id, 
            value, 
            { new: true, runValidators: true }
        );
        
        if (!updatedWorkout) {
            return res.status(404).json({
                success: false,
                message: "Workout not found"
            });
        }
        
        res.json({
            success: true,
            message: "Successfully updated workout",
            data: updatedWorkout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating workout",
            error: error.message
        });
    }
};

// DELETE /api/workouts/:id
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWorkout = await Workout.findByIdAndDelete(id);
        
        if (!deletedWorkout) {
            return res.status(404).json({
                success: false,
                message: "Workout not found"
            });
        }
        
        res.json({
            success: true,
            message: "Successfully deleted workout",
            data: deletedWorkout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting workout",
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
}
const { Workout, User } = require("../models");
const createWorkoutSchema = require("../utils/joi/createWorkoutSchema");

// GET /api/workouts - Get workouts for the authenticated user
const getAll = async (req, res) => {
    try {
        // Get workouts for the authenticated user only
        const workouts = await Workout.find({ username: req.user.username });
        res.json({
            success: true,
            message: "Successfully retrieved workouts",
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

// GET /api/workouts/:id - Get specific workout for authenticated user
const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await Workout.findOne({ 
            _id: id, 
            username: req.user.username 
        });
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: "Workout not found or you don't have permission to access it"
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

// POST /api/workouts - Create new workout
const create = async (req, res) => {
    try {
        // Prepare data with username from authenticated user
        const workoutData = {
            ...req.body,
            username: req.user.username  // Override username with authenticated user
        };

        // Validate input using Joi schema
        const { error, value } = createWorkoutSchema.validate(workoutData);
        
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

// PUT /api/workouts/:id - Update workout for authenticated user
const update = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prepare data with username from authenticated user
        const workoutData = {
            ...req.body,
            username: req.user.username  // Ensure username stays the same
        };
        
        // Validate input using Joi schema
        const { error, value } = createWorkoutSchema.validate(workoutData);
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details[0].message
            });
        }
        
        // Update workout only if it belongs to the authenticated user
        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, username: req.user.username },
            value, 
            { new: true, runValidators: true }
        );
        
        if (!updatedWorkout) {
            return res.status(404).json({
                success: false,
                message: "Workout not found or you don't have permission to update it"
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

// DELETE /api/workouts/:id - Delete workout for authenticated user
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWorkout = await Workout.findOneAndDelete({ 
            _id: id, 
            username: req.user.username 
        });
        
        if (!deletedWorkout) {
            return res.status(404).json({
                success: false,
                message: "Workout not found or you don't have permission to delete it"
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
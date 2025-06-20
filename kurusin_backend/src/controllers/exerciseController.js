const { default:axios } = require("axios");
const { User, Exercise } = require("../models");
const createExerciseSchema = require("../utils/joi/createExerciseSchema");
const WorkoutHistory = require("../models/WorkoutHistory");
require("dotenv").config();

// GET /api/exercises
const getAll = async (req, res) => {
    try {
        let { equipment, muscles } = req.query;

        if (equipment == 'none' || muscles == 'none') {
            equipment = '';
            muscles = '';
        }

        const filter = {};
        if (equipment) filter.equipment = { $regex: new RegExp(equipment, "i") };
        if (muscles) filter.muscles = { $elemMatch: { $regex: new RegExp(muscles, "i") } };

        const exercises = await Exercise.find(filter);

        return res.status(200).json(exercises);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// GET /api/exercises/:id
const getOne = async (req, res) => {
    const { id_exercise } = req.params;
    const { username } = req.query;

    let steps = [];
    let heaviest_weight = 0;
    let best_set_volume = 0;

    const exercise = await Exercise.findOne({ id: id_exercise });
    if (!exercise) return res.status(404).json({ message: "Exercise not found!" });

    const history = await WorkoutHistory.findOne({ username, id_exercise });
    if (history) {
        steps = history.steps || [];
        heaviest_weight = history.heaviest_weight || 0;
        best_set_volume = history.best_set_volume || 0;
    }

    try {
        const result = {
            ...exercise.toObject(),
            steps,
            heaviest_weight,
            best_set_volume
        }
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/exercises
const create = async (req, res) => {
    try {
        await createExerciseSchema.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, equipment, muscles, img } = req.body;

    const latest = await Exercise.findOne().sort({ id: -1 });
    const lastId = latest ? parseInt(latest.id) : 0;
    const newId = (lastId + 1).toString().padStart(4, '0');
    const newExercise = await Exercise.create({ id: newId, name, equipment, muscles, img });
  
    return res.status(201).json(newExercise);
};

// PUT /api/exercises/:id
const update = async (req, res) => {
    const { id } = req.params;
    let updateData = { ...req.body };

    try {
        let updatedExercise = await Exercise.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedExercise) return res.status(404).json({ message: 'Exercise not found!' });
        
        return res.status(200).json(updatedExercise);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};  

// DELETE /api/exercises/:id
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExercise = await Exercise.findOneAndDelete({ id });

        if (!deletedExercise) return res.status(404).json({ message: "Exercise not found!" });

        return res.status(200).json(deletedExercise);
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
    remove,
}
const { default:axios } = require("axios");
const { Exercise, Workout } = require("../models");
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

const getUniqueEquipment = async (req, res) => {
    try {
        const uniqueEquipments = await Exercise.distinct("equipment");
        return res.status(200).json(uniqueEquipments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const getUniqueMuscles = async (req, res) => {
    try {
        const uniqueMuscles = await Exercise.distinct("muscles");
        return res.status(200).json(uniqueMuscles);
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

// GET /api/exercises/:id_exercise/:username
const getOneWithHistory = async (req, res) => {
    try {
        const { id_exercise, username } = req.params;

        const histories = await WorkoutHistory.find({ username })
            .sort({ tanggal: -1 })
            .lean();
        


        for (const history of histories) {
            for (let i = history.workouts.length - 1; i >= 0; i--) {
                const workoutEntry = history.workouts[i];
                const workout = await Workout.findOne({ id: workoutEntry.id_workout }).lean();
                if (!workout) continue;
                console.log(workout.id);

                const exerciseData = workout.exercises.find(e => e.id_exercise === id_exercise);
                if (exerciseData) {
                    const exerciseInfo = await Exercise.findOne({ id: id_exercise }).lean();

                    if (!exerciseInfo) {
                        return res.status(404).json({ message: "Exercise tidak ditemukan di database." });
                    }

                    return res.status(200).json({
                        id: id_exercise,
                        name: exerciseInfo.name,
                        img: exerciseInfo.img,
                        equipment: exerciseInfo.equipment,
                        muscles: exerciseInfo.muscles,
                        steps: exerciseInfo.instructions || [],
                        heaviest_weight: exerciseData.heaviest_weight,
                        best_set_volume: exerciseData.best_set_volume,
                        previous: exerciseData.sets
                    });
                }
            }
        }
        // return res.status(404).json({ message: "Belum ada history untuk exercise ini." });
        const exerciseInfo = await Exercise.findOne({ id: id_exercise }).lean();

        if (!exerciseInfo) {
            return res.status(404).json({ message: "Exercise tidak ditemukan di database." });
        }

        return res.status(200).json({
            id: id_exercise,
            name: exerciseInfo.name,
            img: exerciseInfo.img,
            equipment: exerciseInfo.equipment,
            muscles: exerciseInfo.muscles,
            steps: exerciseInfo.instructions || [],
            heaviest_weight: "",
            best_set_volume: "",
            previous: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const getAllExercisesWithHistory = async (req, res) => {
    try {
        const { username } = req.params;
        let { search, muscles, equipment } = req.query;

        search = search === "none" ? "" : search;
        muscles = muscles === "none" ? "" : muscles;
        equipment = equipment === "none" ? "" : equipment;

        const histories = await WorkoutHistory.find({ username })
            .sort({ tanggal: -1 })
            .lean();
        // Siapkan filter query
        const exerciseQuery = {};

        if (search && search.trim() !== "") {
            exerciseQuery.name = { $regex: search, $options: "i" };
        }

        if (muscles && muscles.trim() !== "") {
            exerciseQuery.muscles = { $regex: muscles, $options: "i" };
        }

        if (equipment && equipment.trim() !== "") {
            exerciseQuery.equipment = { $regex: equipment, $options: "i" };
        }

        const exercises = await Exercise.find(exerciseQuery).lean();

        const results = [];

        for (const exerciseInfo of exercises) {
            let found = false;
            let historyData = {
                heaviest_weight: "",
                best_set_volume: "",
                previous: []
            };

            for (const history of histories) {
                for (let i = history.workouts.length - 1; i >= 0; i--) {
                    const workoutEntry = history.workouts[i];
                    const workout = await Workout.findOne({ id: workoutEntry.id_workout }).lean();
                    if (!workout) continue;

                    const exerciseData = workout.exercises.find(e => e.id_exercise === exerciseInfo.id);
                    if (exerciseData) {
                        historyData = {
                            heaviest_weight: exerciseData.heaviest_weight,
                            best_set_volume: exerciseData.best_set_volume,
                            previous: exerciseData.sets
                        };
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            results.push({
                id: exerciseInfo.id,
                name: exerciseInfo.name,
                img: exerciseInfo.img,
                equipment: exerciseInfo.equipment,
                muscles: exerciseInfo.muscles,
                steps: exerciseInfo.instructions || [],
                ...historyData
            });
        }

        return res.status(200).json(results);
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
    getAllExercisesWithHistory,
    getOne,
    getOneWithHistory,
    create,
    update,
    remove,
    getUniqueEquipment,
    getUniqueMuscles
}
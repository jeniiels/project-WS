const { default:axios } = require("axios");
const { User, Exercise } = require("../models");
require("dotenv").config();

// GET /api/exercises
const getAll = async (req, res) => {
    try {
        const { equipment, muscles } = req.query;

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
    const { id_user } = req.query;

    const user = await User.findOne({ id: id_user });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    let heaviest_weight = 0;
    let best_set_volume = 0;


    
    const options = {
        method: 'GET',
        url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${id_exercise}`,
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_APIKEY,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        

        const result = {
            id: response.data.id,
            name: response.data.name,
            equipment: response.data.equipment,
            muscles: [response.data.target, ...(response.data.secondaryMuscles || [])],
            gif: response.data.gifUrl || "",
            steps: response.data.instructions,
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

};

// PUT /api/exercises/:id
const update = async (req, res) => {

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
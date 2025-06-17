const { default:axios } = require("axios");
const User = require("../models/User");
require("dotenv").config();

// GET  /api/exercises?equipment=none&muscles=none
const fetchExercises = async (req, res) => {
    const { equipment, muscles } = req.query;
    let options = null;

    if (equipment == 'none' && muscles == 'none') {
        options = {
            method: 'GET',
            url: `https://exercisedb.p.rapidapi.com/exercises`,
            params: {
                limit: '100',
                offset: '0'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_APIKEY,
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        };
    }
    else if (equipment != 'none') {
        options = {
            method: 'GET',
            url: `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`,
            params: {
                limit: '100',
                offset: '0'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_APIKEY,
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        };
    }
    else if (muscles != 'none') {
        options = {
            method: 'GET',
            url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${muscles}`,
            params: {
                limit: '100',
                offset: '0'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_APIKEY,
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        };
    }

    try {
		const response = await axios.request(options);
        const result = response.data.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            equipment: exercise.equipment,
            muscles: [exercise.target, ...(exercise.secondaryMuscles || [])],
            img: exercise.gifUrl || ""
        }));
        return res.status(200).json(result);
	} catch (error) {
		console.error(error);
	}
};

// GET /api/exercise/:id_exercise
const detailExercise = async (req, res) => {
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
        } catch (error) {
            console.error(error);
        }
};

module.exports = { 
    fetchExercises,
    detailExercise
}
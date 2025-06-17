// GET /api/diary
const getDiary = async (req, res) => {

};

// POST /api/scan
const scan = async (req, res) => {

};

// GET /api/fetch
const fetchExercise = async (req, res) => {
    let options = {
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

// GET /api/recommendation
const fetchRecommendation = async (req, res) => {

};

// GET /api/calories
const fetchCalory = async (req, res) => {

};

module.exports = {
    getDiary,
    scan,
    fetchExercise,
    fetchRecommendation,
    fetchCalory
};
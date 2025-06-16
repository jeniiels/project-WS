const Workout = require("../models/Workout");

const saveWorkout = async (req, res) => {
    const { id_user } = req.query;
    const { time, duration, exercises } = req.body;
    const workout = {
        id_user,
        time,
        duration,
        exercises
    };
    await Workout.create(workout);
};

const lastWorkout = async (req, res) => {
    const { id_exercise } = req.params;
    const { id_user } = req.query;

    try {
        const workout = await Workout.findOne({ id_user, "exercises.id_exercise": id_exercise })
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
    saveWorkout,
    lastWorkout
}
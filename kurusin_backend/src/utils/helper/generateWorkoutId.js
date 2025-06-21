const Workout = require("../../models/Workout");

const generateWorkoutId = async () => {
    const latest = await Workout.findOne().sort({ createdAt: -1 }).lean();
    let lastId = latest?.id ?? 'WO000';
    let number = parseInt(lastId.slice(2)) + 1;
    console.log(`Generating new workout ID: ${lastId} -> ${number}`);
    return 'WO' + number.toString().padStart(3, '0');
};

module.exports = generateWorkoutId;
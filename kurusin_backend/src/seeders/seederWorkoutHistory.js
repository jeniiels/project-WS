const mongoose = require('mongoose');
require('dotenv').config();
const { Workout, WorkoutHistory} = require('../models');

const parseSet = (setStr) => {
    const match = setStr.match(/(\d+)\s+reps\s+x\s+(\d+)\s+kg/i);
    if (!match) return null;
    const reps = parseInt(match[1]);
    const weight = parseInt(match[2]);
    return { reps, weight, volume: reps * weight };
};

const calculateHeaviestSet = (sets) => {
    let heaviest = { weight: 0, raw: "" };
    sets.forEach(str => {
        const parsed = parseSet(str);
        if (parsed && parsed.weight > heaviest.weight) {
            heaviest = { weight: parsed.weight, raw: str };
        }
    });
    return heaviest.raw;
};

const calculateBestVolume = (sets) => {
    let maxVolume = 0;
    sets.forEach(str => {
        const parsed = parseSet(str);
        if (parsed && parsed.volume > maxVolume) {
            maxVolume = parsed.volume;
        }
    });
    return maxVolume;
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const workouts = await Workout.find({});
    await WorkoutHistory.deleteMany({});

    const historyData = workouts.map(w => {
        const allSets = w.exercises.flatMap(e => e.sets);
        return new WorkoutHistory({
            username: w.username,
            workout_id: w._id,
            timestamp: w.time,
            heaviest_set: calculateHeaviestSet(allSets),
            best_set_volume: calculateBestVolume(allSets)
        });
    });

    await WorkoutHistory.insertMany(historyData);
    console.log('WorkoutHistory dummy seeded!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

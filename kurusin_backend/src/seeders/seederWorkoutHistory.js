const mongoose = require('mongoose');
require('dotenv').config();

const Workout = require('../models/Workout');
const WorkoutHistory = require('../models/WorkoutHistory');

const parseSet = (setStr) => {
    const match = setStr.match(/(\d+)\s*reps\s*x\s*(\d+)\s*kg/i);
    if (!match) return null;
    const reps = parseInt(match[1]);
    const weight = parseInt(match[2]);
    return { reps, weight, volume: reps * weight };
};

const buildExerciseResult = (exercise) => {
    const parsedSets = exercise.sets.map(parseSet).filter(Boolean);
    if (parsedSets.length === 0) return {
        id_exercise: exercise.id_exercise,
        heaviest_weight: "0kg",
        best_set_volume: "0kg x 0"
    };

    const heaviest = parsedSets.reduce((a, b) => a.weight > b.weight ? a : b);
    const bestVolume = parsedSets.reduce((a, b) => a.volume > b.volume ? a : b);

    return {
        id_exercise: exercise.id_exercise,
        heaviest_weight: `${heaviest.weight}kg`,
        best_set_volume: `${bestVolume.weight}kg x ${bestVolume.reps}`
    };
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const workouts = await Workout.find({});
    await WorkoutHistory.deleteMany({});

    const histories = workouts.map(w => {
        return new WorkoutHistory({
            username: w.username,
            id_workout: w.id,
            tanggal: new Date(w.time).toISOString().slice(0, 10),
            duration: w.duration,
            exercises: w.exercises.map(buildExerciseResult)
        });
    });

    await WorkoutHistory.insertMany(histories);
    console.log("WorkoutHistory seeded!");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

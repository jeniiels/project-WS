const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const moment = require('moment');

const {User, Workout, WorkoutHistory} = require('../models');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const workouts = await Workout.find({});
    const users = await User.find({}).select('username -_id');
    await WorkoutHistory.deleteMany({});

    const usernames = users.map(u => u.username);

    if (usernames.length === 0) {
        console.error("Tidak ada user ditemukan di collection User.");
        process.exit(1);
    }

    const grouped = {};

    for (const w of workouts) {
        const username = faker.helpers.arrayElement(usernames);
        const tanggal = faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString().slice(0, 10);
        const key = `${username}_${tanggal}`;
        const randomDate = faker.date.between({ from: '2025-01-01', to: '2025-12-31' });
        const time = moment(randomDate).format('dddd, MMM D, YYYY - h:mma');

        if (!grouped[key]) {
            grouped[key] = {
                username,
                tanggal,
                workouts: [],
                summary: {
                    duration: 0,
                    kalori: 0,
                }
            };
        }

        const hours = faker.number.int({ min: 0, max: 2 });
        const minutes = faker.number.int({ min: 1, max: 59 });
        const durationStr = `${hours}h ${minutes}min`;

        grouped[key].workouts.push({
            id_workout: w.id,
            time,
            duration_total: durationStr
        });

        const totalMinutes = hours * 60 + minutes;
        grouped[key].summary.duration += totalMinutes;

        grouped[key].summary.kalori += w.kalori_total || 0;
    }

    const histories = Object.values(grouped).map(h => ({
        username: h.username,
        tanggal: h.tanggal,
        workouts: h.workouts,
        summary: {
            duration: `${h.summary.duration} menit`,
            kalori: h.summary.kalori
        }
    }));

    await WorkoutHistory.insertMany(histories);
    console.log("Dummy workouthistories seeded!");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

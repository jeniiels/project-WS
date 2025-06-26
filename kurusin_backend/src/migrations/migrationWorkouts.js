const mongoose = require("mongoose");
const { Workout } = require("../models");
require("dotenv").config();

module.exports = async function migrateWorkouts() {
    await Workout.createCollection();
    console.log("Workout collection created!");
};

const mongoose = require("mongoose");
const { Exercise } = require("../models");
require("dotenv").config();

module.exports = async function migrateExercise() {
    await Exercise.createCollection();
    console.log("Exercise collection created!");
};

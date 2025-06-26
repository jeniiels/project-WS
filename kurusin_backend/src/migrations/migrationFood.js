const mongoose = require("mongoose");
const { Food } = require("../models");
require("dotenv").config();

module.exports = async function migrateFood() {
    await Food.createCollection();
    console.log("Food collection created!");
};

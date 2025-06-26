const mongoose = require("mongoose");
const { User } = require("../models");
require("dotenv").config();

module.exports = async function migrateUser() {
    await User.createCollection();
    console.log("User collection created!");
};

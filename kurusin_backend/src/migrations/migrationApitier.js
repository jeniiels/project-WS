const mongoose = require("mongoose");
const { Apitier } = require("../models");
require("dotenv").config();

module.exports = async function migrateApitier() {
    await Apitier.createCollection();
    console.log("Apitier collection created!");
};



// const mongoose = require("mongoose");
// const { Apitier } = require("../models");
// require("dotenv").config();

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(async () => {
//     await Apitier.createCollection();
//     console.log("Apitier collection created!");
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });

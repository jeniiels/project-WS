require("dotenv").config();

module.exports = {
    connection: {
        uri: process.env.MONGO_URI,
    },
};

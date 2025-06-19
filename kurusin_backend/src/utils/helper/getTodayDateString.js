const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

module.exports = getTodayDateString;
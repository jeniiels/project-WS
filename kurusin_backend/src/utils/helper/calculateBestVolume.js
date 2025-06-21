const parseSet = require('./parseSet');

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

module.exports = calculateBestVolume;
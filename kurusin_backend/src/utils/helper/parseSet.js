const parseSet = (setStr) => {
    const match = setStr.match(/^(\d+(\.\d+)?)kg\sx\s(\d+)$/i);
    if (!match) return null;
    const weight = parseFloat(match[1]);
    const reps = parseInt(match[3]);
    return { weight, reps, volume: weight * reps };
};

module.exports = parseSet;
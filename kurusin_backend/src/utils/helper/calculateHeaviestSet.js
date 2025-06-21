const parseSet = require("./parseSet");

const calculateHeaviestSet = (sets) => {
    let heaviest = { weight: 0, raw: "" };
    sets.forEach(str => {
        const parsed = parseSet(str);
        if (parsed && parsed.weight > heaviest.weight) {
            heaviest = { weight: parsed.weight, raw: str };
        }
    });
    return heaviest.weight + "kg";
};

module.exports = calculateHeaviestSet;
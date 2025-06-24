const  splitNumberAndUnit = (input) => {
    const match = input.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
    if (!match) return { value: null, unit: null };
    
    return {
        value: parseFloat(match[1]),
        unit: match[2]
    };
}

module.exports = splitNumberAndUnit;
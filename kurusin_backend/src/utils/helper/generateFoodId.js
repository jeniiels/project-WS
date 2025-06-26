const Food = require("../../models/Food");

const generateFoodId = async () => {
    const lastFood = await Food.findOne({ id: { $regex: /^FNB\d{5}$/ } }).sort({ id: -1 }).lean();
    let nextNumber = 1;
    if (lastFood && lastFood.id) {
        nextNumber = parseInt(lastFood.id.slice(3), 10) + 1;
    }
    return `FNB${String(nextNumber).padStart(5, "0")}`;
};

module.exports = generateFoodId;
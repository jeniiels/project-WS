const { Food } = require("../models");
const generateFoodId = require("../utils/helper/generateFoodId");

// GET /api/foods
const getAll = async (req, res) => {
    try {
        const q = req.query.q || "";
        const foods = await Food.find({ name: { $regex: new RegExp(q, "i") } });

        const result = foods.map((food) => ({
            id: food.id || food._id,
            name: food.name,
            nutrient_fact: food.nutrient_fact_100g || food.nutrient_fact,
            image: food.image,
        }));

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// GET /api/foods/:id
const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findOne({ id: id });

        if (!food) return res.status(404).json({ message: "Food not found!" })

        return res.status(200).json({
            id: food.id,
            name: food.name,
            nutrient_fact: food.nutrient_fact_100g,
            image: food.image,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/foods
const create = async (req, res) => {
    try {
        const foodData = req.body;

        foodData.id = await generateFoodId();

        const food = new Food(foodData);
        await food.save();

        return res.status(201).json({
            id: food.id,
            name: food.name,
            nutrient_fact: food.nutrient_fact_100g,
            image: food.image,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/foods/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (updateData.nutrient_fact_100g) {
            Object.keys(updateData.nutrient_fact_100g).forEach((key) => {
                updateData[`nutrient_fact_100g.${key}`] =
                updateData.nutrient_fact_100g[key];
            });
            delete updateData.nutrient_fact_100g;
        }

        const updatedFood = await Food.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedFood) return res.status(404).json({ message: "Food not found!" });
        
        return res.status(200).json(updatedFood);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/foods/:id
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFood = await Food.findOneAndDelete({ id: id });

        if (!deletedFood) return res.status(404).json({ message: "Food not found!" });

        return res.status(200).json(deletedFood);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
};

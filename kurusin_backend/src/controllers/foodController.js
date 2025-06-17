const { Food } = require("../models");

/**
 * ------------------------------------------------------------------------------
 * GET /api/foods/                                                              |
 * This endpoint retrieves all foods from the database.                         |       
 * It supports an optional query parameter `q` for searching food names.        |
 * * @param {Object} req - The request object containing query parameters.      |
 * * @param {Object} res - The response object used to send the result.         |
 * ------------------------------------------------------------------------------
 */
const getAllFoods = async (req, res) => {
  try {
    const q = req.query.q || '';
    console.log('Received query q:', q);

    const query = new RegExp(q, 'i'); // Case-insensitive regex for search

    const foods = await Food.find({
      name: { $regex: query }
    });

    console.log('Matched foods:', foods);

    const result = foods.map(food => ({
      id: food.id || food._id,
      name: food.name,
      nutrient_fact: food.nutrient_fact_100g,
      image: food.image
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error during getAllFoods:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ------------------------------------------------------------------------------
 * GET /api/foods/:id                                                          |
 * This endpoint retrieves a specific food by its ID.                           |
 * If the food is not found, it returns a 404 status code.                      |
 * * @param {Object} req - The request object containing the food ID in params.|
 * * @param {Object} res - The response object used to send the result.         |
 * ------------------------------------------------------------------------------
 */
const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findOne({ id: id });

        // If food not found, return 404
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        return res.status(200).json({
            id: food.id || food._id,
            name: food.name,
            nutrient_fact: food.nutrient_fact_100g,
            image: food.image,
        })
    } catch (error) {
        console.log('Error during getFoodById:', error);
        res.status(500).json({ message: error.message });
    }
};

const insertFood = async (req, res) => {
    try {
        const foodData = req.body;
        const food = new Food(foodData);
        const savedFood = await food.save();

        return res.status(201).json(savedFood);
        
    } catch (error) {
        console.log('Error during insertFood:', error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
  getAllFoods,
  getFoodById,
  insertFood,
};

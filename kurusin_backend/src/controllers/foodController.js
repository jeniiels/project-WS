const Food = require('../models/Food');
const Joi = require('joi');

// GET /api/foods
const getAllFoods = async (req, res) => {
    try {
        const { page = 1, limit = 50, search } = req.query;
        
        let filter = {};
        if (search) {
            filter = {
                name: { $regex: search, $options: 'i' }
            };
        }
        
        const foods = await Food.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            
        const total = await Food.countDocuments(filter);
        
        return res.status(200).json({
            foods,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching foods:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// GET /api/foods/:id
const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const food = await Food.findOne({ id });
        
        if (!food) {
            return res.status(404).json({ message: "Food not found." });
        }
        
        return res.status(200).json(food);
    } catch (error) {
        console.error("Error fetching food:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// POST /api/foods
const createFood = async (req, res) => {
    try {
        const foodSchema = Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            jumlah_sajian_per_kemasan: Joi.number().default(1),
            jumlah_per_sajian: Joi.number().default(0),
            tipe_sajian: Joi.string().default(''),
            nutrient_fact_100g: Joi.object().default({}),
            nutrient_fact_per_serving: Joi.object().required(),
            image: Joi.string().optional()
        });
        
        const { error, value } = foodSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.details[0].message 
            });
        }
        
        const food = await Food.create(value);
        
        return res.status(201).json({
            message: "Food created successfully",
            food
        });
    } catch (error) {
        console.error("Error creating food:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    getAllFoods,
    getFoodById,
    createFood
};
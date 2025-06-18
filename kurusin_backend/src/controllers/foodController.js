const { Food } = require("../models");
const { message } = require("../utils/joi/createUserSchema");

// Generate ID for new food items
const generateFoodId = async () => {
  const lastFood = await Food.findOne({ id: { $regex: /^FNB\d{5}$/ } })
    .sort({ id: -1 })
    .lean();

  let nextNumber = 1;
  if (lastFood && lastFood.id) {
    nextNumber = parseInt(lastFood.id.slice(3), 10) + 1;
  }
  // Pad dengan nol di depan agar 5 digit
  return `FNB${String(nextNumber).padStart(5, "0")}`;
};

// GET /api/foods
const getAll = async (req, res) => {
  try {
    const q = req.query.q || "";
    console.log("Received query q:", q);

    const query = new RegExp(q, "i"); // Case-insensitive regex for search

    const foods = await Food.find({
      name: { $regex: query },
    });

    console.log("Matched foods:", foods);

    const result = foods.map((food) => ({
      id: food.id || food._id, // fallback ke _id jika id tidak ada
      name: food.name,
      nutrient_fact: food.nutrient_fact_100g || food.nutrient_fact,
      image: food.image,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error during getAllFoods:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/foods/:id
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findOne({ id: id }); // cari berdasarkan field id

    if (!food) {
      return res
        .status(404)
        .json({ status: "fail", message: "Food not found" });
    }

    return res.status(200).json({
      id: food.id,
      name: food.name,
      nutrient_fact: food.nutrient_fact_100g,
      image: food.image,
    });
  } catch (error) {
    console.error("Error during getOneFood:", error);
    res.status(500).json({ message: error.message });
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
  } catch (error) {
    console.error("Error during createFood:", error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/foods/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Jika ada nutrient_fact_100g, ubah ke dot notation
    if (updateData.nutrient_fact_100g) {
      Object.keys(updateData.nutrient_fact_100g).forEach((key) => {
        updateData[`nutrient_fact_100g.${key}`] =
          updateData.nutrient_fact_100g[key];
      });
      delete updateData.nutrient_fact_100g;
    }

    const updatedFood = await Food.findOneAndUpdate(
      { id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.status(200).json({
      message: "Food updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    console.error("Error during updateFood:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/foods/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFood = await Food.findOneAndDelete({ id: id });

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.status(200).json({
      message: "Food deleted successfully",
      data: deletedFood,
    });
  } catch (error) {
    console.error("Error during removeFood:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

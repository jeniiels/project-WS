const express = require('express');
const router = express.Router();
const { getAllFoods, getFoodById, insertFood } = require('../controllers/foodController');

// Rute untuk GET /api/foods/
router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', insertFood);

module.exports = router;
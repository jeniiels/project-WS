const express = require('express');
const router = express.Router();

const { getAllFoods, getFoodById, createFood } = require('../controllers/foodController');

router.get('/', getAllFoods);        // GET /api/foods
router.get('/:id', getFoodById);     // GET /api/foods/:id
router.post('/', createFood);        // POST /api/foods

module.exports = router;

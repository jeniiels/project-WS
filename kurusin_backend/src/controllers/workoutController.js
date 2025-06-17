const { Workout } = require("../models");

// GET /api/workouts
const getAll = async (req, res) => {
    res.json({
        success: true,
        message: "This is GET /api/workouts endpoint"
    });
};

// GET /api/workouts/:id
const getOne = async (req, res) => {
    res.json({
        success: true,
        message: "This is GET /api/workouts/:id endpoint",
        id: req.params.id
    });
};

// POST /api/workouts
const create = async (req, res) => {
    res.json({
        success: true,
        message: "This is POST /api/workouts endpoint"
    });
};

// PUT /api/workouts/:id
const update = async (req, res) => {
    res.json({
        success: true,
        message: "This is PUT /api/workouts/:id endpoint",
        id: req.params.id
    });
};

// DELETE /api/workouts/:id
const remove = async (req, res) => {
    res.json({
        success: true,
        message: "This is DELETE /api/workouts/:id endpoint",
        id: req.params.id
    });
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
}
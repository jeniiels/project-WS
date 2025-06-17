const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const getAllUsers = async (req, res) => {
    const users = await User.find();
    return res.status(200).json({ users});
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(20).required(),
        });
    
        res.status(201).json({ message: 'User registered successfully', user: { name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
}

module.exports = {
    getAllUsers,
    register,
};
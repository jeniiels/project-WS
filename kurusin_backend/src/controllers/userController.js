const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const createUserSchema = require("../utils/joi/createUserSchema");

// GET /api/users
const getAll = async (req, res) => {
    const result = await User.find();
    return res.status(200).json(result);
};

// GET /api/users/:username
const getOne = async (req, res) => {
    const { username } = req.params;
    const result = await User.find({ username: username });
    if (!result) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(result);
};

// POST /api/users
const create = async (req, res) => {
    try {
        await createUserSchema.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { username, name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
        username,
        name,
        email,
        password: hashedPassword
    });

    return res.status(201).json(newUser);
};

// PUT /api/users/:id
const update = async (req, res) => {
    const { username } = req.params;
    const { name, email, password } = req.body;

    // Find user by username
    const user = await User.find({ username: username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
        user.password = await bcryptjs.hash(password, 10);
    }

    const updatedUser = await User.updateOne(
        {username: username}, 
        {
        name: user.name,
        email: user.email,
        password: user.password // Uncomment if you want to update password
    });
    return res.status(200).json(updatedUser);
};

// DELETE /api/users/:id
const remove = async (req, res) => {
    const { username } = req.params;

    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await User.deleteOne({ username: username });
    return res.status(200).json({ message: "User deleted successfully" });
};

// POST /api/users/login
const login = async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = user && await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
    return res.status(200).json({ token });
};

// POST /api/users/register
const register = async (req, res) => {
    
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    login,
    register
};
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Apitier } = require("../models");
const createUserSchema = require("../utils/joi/createUserSchema");

// Helper function to get API quota for subscription tier
const getApiQuotaForTier = async (subscriptionTier) => {
    try {
        const tier = await Apitier.findOne({ name: subscriptionTier });
        return tier ? tier.monthlyQuota : 0;
    } catch (error) {
        // Default quotas if Apitier collection is not populated
        const defaultQuotas = {
            'free': 100,
            'basic': 1000,
            'premium': 10000
        };
        return defaultQuotas[subscriptionTier] || 0;
    }
};

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

    // Generate JWT token with user data including new fields
    const tokenPayload = {
        username: user.username,
        email: user.email,
        saldo: user.saldo,
        subscription: user.subscription,
        apiQuota: user.apiQuota
    };

    const token = jwt.sign(
        tokenPayload, 
        process.env.JWT_SECRET || "secretkey", 
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );
    
    return res.status(200).json({ token });
};

// POST /api/users/register
const register = async (req, res) => {
    try {
        // Validate input using Joi schema
        await createUserSchema.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { username, name, email, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ message: "Username sudah digunakan" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(409).json({ message: "Email sudah digunakan" });
    }

    try {
        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        // Get API quota for free tier (default)
        const initialApiQuota = await getApiQuotaForTier('free');
        
        // Create new user
        const newUser = await User.create({
            username,
            name,
            email,
            password: hashedPassword,
            saldo: 0,
            subscription: 'free',
            apiQuota: initialApiQuota
        });

        // Generate JWT token with user data
        const tokenPayload = {
            username: newUser.username,
            email: newUser.email,
            saldo: newUser.saldo,
            subscription: newUser.subscription,
            apiQuota: newUser.apiQuota
        };

        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET || "secretkey", 
            { expiresIn: process.env.JWT_EXPIRATION || "1h" }
        );

        return res.status(201).json({
            message: "Registrasi berhasil",
            token: token
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Terjadi kesalahan saat mendaftar", 
            error: error.message 
        });
    }
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
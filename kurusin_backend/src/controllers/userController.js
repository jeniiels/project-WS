const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { User } = require("../models");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res) => {
    try {
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(20).required(),
            username: Joi.string().min(3).max(20).required()
        });

        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.details[0].message 
            });
        }

        const { name, email, password, username } = value;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email or username already exists' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(password, saltRounds);        // Create user
        const user = await User.create({
            name,
            email,
            username,
            password: hashedPassword
        });

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { 
                _id: user._id,
                name: user.name, 
                email: user.email,
                username: user.username,
                createdAt: user.createdAt
            } 
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.details[0].message 
            });
        }

        const { email, password } = value;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }        // Generate JWT token
        const token = jwt.sign(
            { 
                _id: user._id, 
                email: user.email,
                username: user.username 
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    register,
    login
};
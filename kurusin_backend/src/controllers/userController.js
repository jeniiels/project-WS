const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const createUserSchema = require("../utils/joi/createUserSchema");
const getApiQuotaForTier = require("../utils/helper/getApiQuotaforTier");
const {FoodHistory, WorkoutHistory} = require("../models");
const Workout = require("../models/Workout");

// GET /api/users
const getAll = async (req, res) => {
    try {
        const query = { ...req.query };
        const users = await User.find(query).select('-password -subscriptionDate -apiQuota -createdAt -updatedAt');
        if (!users) return res.status(404).json({ message: "User not found!" });
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

// const getOne = async (req, res) => {
//     try {
//         const { username } = req.params;

//         const user = await User.findOne({ username })
//             .select('username email createdAt');

//         if (!user) return res.status(404).json({ message: "User not found!" });

//         const workoutHistories = await WorkoutHistory.find({ username }).lean();
//         const workoutHistoryFormatted = workoutHistories.map(w => ({
//             type: 'workout',
//             timestamp: w.timestamp,
//             ...w
//         }));

//         const foodHistories = await FoodHistory.find({ username }).lean();
//         const foodHistoryFormatted = foodHistories.map(f => ({
//             type: 'food',
//             timestamp: new Date(f.createdAt),
//             ...f
//         }));

//         const fullHistory = [...workoutHistoryFormatted, ...foodHistoryFormatted]
//             .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//         return res.status(200).json({
//             status: "success",
//             data: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 createdAt: user.createdAt,
//                 history: fullHistory
//             }
//         });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: err.message });
//     }
// };

const getOne = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .select('username email createdAt');

        if (!user) return res.status(404).json({ message: "User not found!" });

        const workoutHistories = await WorkoutHistory.find({ username }).lean();
        const allWorkouts = [];

        for (const history of workoutHistories) {
            for (const workout of history.workouts) {
                const workoutDetail = await Workout.findOne({ id: workout.id_workout }).lean();

                allWorkouts.push({
                    id_workout: workout.id_workout,
                    time: workout.time,
                    duration_total: workout.duration_total,
                    kalori_total: workoutDetail ? workoutDetail.kalori_total : 0
                });
            }
        }

        return res.status(200).json(allWorkouts);
        // return res.status(200).json(workoutHistories);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

// POST /api/users
const create = async (req, res) => {
    try {
        await createUserSchema.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { username, name, email, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists!" });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists!" });
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    const initialApiQuota = await getApiQuotaForTier('free');
    
    const newUser = await User.create({
        username,
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        saldo: 0,
        subscription: 'free',
        apiQuota: initialApiQuota
    });

    return res.status(201).json(newUser);
};

const pp = async (req, res) => {
    return res.status(200).json({ message: "Profile picture uploaded!" })
};

// PUT /api/users/:username
const update = async (req, res) => {
    const { username } = req.params;
    const { name, email, password, role } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && ['user', 'admin'].includes(role)) updateData.role = role;
    
    if (password) updateData.password = await bcryptjs.hash(password, 10);
    
    try {
        let updatedUser = await User.findOneAndUpdate(
            { username: username },
            updateData,
            { new: true, runValidators: true }
        );

        updatedUser = updatedUser.toObject();
        updatedUser.password = password;
        delete updatedUser._id;
        delete updatedUser.createdAt;
        delete updatedUser.updatedAt;

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/users/:id
const remove = async (req, res) => {
    try {
        const { username } = req.params;
        const deletedUser = await User.findOneAndDelete({ username });

        if (!deletedUser) return res.status(404).json({ message: "User not found!" });

        return res.status(200).json(deletedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users/login
const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const isPasswordValid = user && await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });
    
    const tokenPayload = {
        username: user.username,
        email: user.email,
        role: user.role,
        saldo: user.saldo,
        subscription: user.subscription,
        apiQuota: user.apiQuota
    };

    const token = jwt.sign(
        tokenPayload, 
        process.env.JWT_SECRET || "secretkey", 
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );
    
    return res.status(200).json(user);
};

// POST /api/users/register
const register = create;

module.exports = {
    getAll,
    getOne,
    create,
    pp,
    update,
    remove,
    login,
    register
};
const { Apilog, User, Apitier } = require("../models");
const jwt = require("jsonwebtoken");
const getApiQuotaForTier = require("../utils/helper/getApiQuotaforTier");

// GET /api/logs - get all logsAdd commentMore actions
const getAllLogs = async (req, res) => {
    try {
        const logs = await Apilog.find({}).sort({ timestamp: -1 }).limit(100);
        return res.status(200).json(logs);
    } catch (err) {
        console.error(err);
    }
};

// GET /api/logs/:username
const getLogs = async (req, res) => {
    try {
        const { username } = req.params;
        const logs = await Apilog.find({ apiKey: username }).sort({ timestamp: -1 }).limit(100);
        if (!logs || logs.length === 0) return res.status(404).json({ message: "No logs found for this user!" });
        return res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/subscribe
const subscribe = async (req, res) => {
    try {
        const { tier } = req.body;
        const username = req.user.username;        

        if (tier == "") 
            return res.status(400).json({ message: "Tier is required!" });

        const validTiers = ['free', 'basic', 'premium'];
        if (!validTiers.includes(tier.toLowerCase()))  
            return res.status(400).json({ message: "Tier is invalid!" });        
        
        const currentUser = await User.findOne({ username });
        if (!currentUser) 
            return res.status(404).json({ message: "User not found!" });

        if (currentUser.subscription == tier.toLowerCase()) {
            if (currentUser.apiQuota > 10) {
                return res.status(400).json({ 
                    message: "You are already subscribed to this tier and still have sufficient quota!", 
                    details: {
                        currentQuota: currentUser.apiQuota,
                        minimumForResubscription: 10
                    }
                });
            }
        }

        const tierData = await Apitier.findOne({ name: tier.toLowerCase() });
        if (!tierData) return res.status(404).json({ message: "Tier data not found!" });

        if (currentUser.saldo < tierData.price) {
            return res.status(400).json({ 
                message: "Insufficient balance!", 
                details: {
                    required: tierData.price,
                    current: currentUser.saldo,
                    shortfall: tierData.price - currentUser.saldo
                }
            });
        }        
        
        const newApiQuota = await getApiQuotaForTier(tier.toLowerCase());
        
        const newSaldo = Number(currentUser.saldo) - Number(tierData.price);
        const updatedUser = await User.findOneAndUpdate(
            {
                username 
            },
            { 
                subscription: tier.toLowerCase(),
                subscriptionDate: new Date(),
                apiQuota: newApiQuota,
                saldo: newSaldo
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password');

        const tokenPayload = {
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            saldo: updatedUser.saldo,
            subscription: updatedUser.subscription,
            apiQuota: updatedUser.apiQuota
        };

        const newToken = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET || "secretkey", 
            { expiresIn: process.env.JWT_EXPIRATION || "1h" }
        );

        return res.status(200).json({
            success: true,
            message: `Successfully subscribed user to ${tier} tier!`,
            data: {
                username: updatedUser.username,
                name: updatedUser.name,
                subscription: updatedUser.subscription,
                subscriptionDate: updatedUser.subscriptionDate,
                apiQuota: updatedUser.apiQuota,
                saldo: updatedUser.saldo,
                paidAmount: tierData.price
            },
            token: newToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/saldo
const addSaldo = async (req, res) => {
    try {
        const { saldo } = req.body;
        const username = req.user.username;

        if (!saldo) {
            return res.status(400).json({ 
                success: false,
                message: "Saldo amount is required!" 
            });
        }

        const saldoAmount = parseFloat(saldo);
        if (isNaN(saldoAmount) || saldoAmount <= 0) {
            return res.status(400).json({ 
                success: false,
                message: "Saldo must be a positive number!" 
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { 
                username 
            },
            { 
                $inc: { saldo: saldoAmount }
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Successfully added ${saldoAmount} to your balance!`,
            data: {
                username: updatedUser.username,
                name: updatedUser.name,
                previousBalance: updatedUser.saldo - saldoAmount,
                addedAmount: saldoAmount,
                currentBalance: updatedUser.saldo,
                subscription: updatedUser.subscription
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Error adding saldo",
            error: err.message 
        });
    }
};

module.exports = {
    getLogs,
    getAllLogs,
    subscribe,
    addSaldo
};
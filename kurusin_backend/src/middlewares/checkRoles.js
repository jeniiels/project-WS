const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user; 
        if (!user || !user.role) 
            return res.status(401).json({ message: 'Unauthorized: role not found!' });
        if (!allowedRoles.includes(user.role)) 
            return res.status(403).json({ message: 'Forbidden!' });
        
        next();
    };
};

module.exports = checkRoles;
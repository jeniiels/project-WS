const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./src/database/connection');
connectDB();

// Import middlewares
const checkSubscription = require('./src/middlewares/checkSubscription');
const updateApiHit = require('./src/middlewares/updateApiHit');

// Import routes
const { userRoutes, exerciseRoutes, workoutRoutes, foodRoutes, apiRoutes } = require('./src/routes');

// Routes without middleware protection
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);

// Routes with middleware protection
app.use('/api/exercises', checkSubscription, updateApiHit, exerciseRoutes);
app.use('/api/workouts', checkSubscription, updateApiHit, workoutRoutes);

// API management routes
app.use('/api', apiRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
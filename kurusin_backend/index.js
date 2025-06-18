require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./src/database/connection');
connectDB();

const { userRoutes, foodRoutes, exerciseRoutes, workoutRoutes, otherRoutes } = require('./src/routes');
app.use('/api/users', userRoutes);
app.use('/api/foods/', foodRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api', otherRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
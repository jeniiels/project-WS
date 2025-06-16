const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./src/database/connection');
connectDB();

const { userRoutes, exerciseRoutes, workoutRoutes } = require('./src/routes');
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workout', workoutRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
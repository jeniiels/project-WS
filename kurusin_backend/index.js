const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./src/database/connection');
connectDB();

const { userRoutes } = require('./src/routes');
app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
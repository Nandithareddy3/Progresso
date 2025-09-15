const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(express.json())//middleware to accept the json data in the body of requests
app.use(cors());
//routes
const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);
const householdRoutes = require('./routes/householdRoutes.js');
app.use('/api/households', householdRoutes);
const choreRoutes = require('./routes/choreRoutes.js');
app.use('/api/chores', choreRoutes);
const assignmentRoutes = require('./routes/assignmentRoutes.js');
app.use('/api/assignments', assignmentRoutes);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDB connected');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};
connectDB();
app.get('/', (req, res) => res.send('API is running'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
// configuring .env 
require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cors = require('cors');

const cron = require("node-cron");

// for Cross Origin Requests
app.use(cors());
app.use(express.json());

app.use((req ,res ,next)=>{
    console.log(req.path, req.method);
    next();
})

// Use Routes 
app.use('/api/tasks', taskRoutes);
// Auth Routes 
app.use('/api/auth', authRoutes)
// User Routes 
app.use('/api/user', userRoutes)

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log('Listening on port 4000');
        });
    })
    .catch((err)=>{
        console.log(err);
    })

// TO Prevent Render from sleeping in 15 minutes 
cron.schedule('*/14 * * * *', async () => {
        const run  = await axios.get("https://task-backend-bliy.onrender.com")
});
      
    

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);

// Connect to the database
const startServer = async () => {
    try {
        await connectDB(); 
        console.log('Connected to the database');

        const User = require('./models/User');
        const Contact = require('./models/Contact');

        await User.sync(); 
        await Contact.sync(); 
        console.log('Database synced');

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1); 
    }
};

// Initialize the server
startServer();

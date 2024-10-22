// const { Sequelize } = require('sequelize');
// const dotenv = require('dotenv');

// dotenv.config();

// const sequelize = new Sequelize(process.env.DB_URL, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 5432,
//     dialect: 'postgres',
// });

// const connectDB = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// };

// module.exports = { sequelize, connectDB };

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // This enables SSL
            rejectUnauthorized: false, // This allows self-signed certificates (if applicable)
        },
    },
});
// Function to connect to the database
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        // Optionally exit the process if you cannot connect to the database
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };

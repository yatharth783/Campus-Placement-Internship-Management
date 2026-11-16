require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect Database and start listening
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CampusConnect Backend Server running on port ${PORT}`);
    console.log(`📡 Base URL: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err) => {
    console.error(`[Fatal Unhandled Rejection]: ${err.message}`);
  });
});

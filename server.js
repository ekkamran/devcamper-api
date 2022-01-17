const express = require("express");
const morgan = require("morgan");
const errorHandler = require('./middleware/error');
const dotenv = require("dotenv");
const colors = require("colors");

const connectDB = require('./config/db')


// Load env vars
dotenv.config({ path: "./config/config.env" });

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());


// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
const api = process.env.API;

app.use(`${api}/bootcamps`, bootcamps);
app.use(`${api}/courses`, courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1))
});
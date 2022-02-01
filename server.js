const path = require('path');
const express = require("express");
const morgan = require("morgan");
const errorHandler = require('./middleware/error');
const dotenv = require("dotenv");
const colors = require("colors");
const xss = require("xss-clean");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const fileupload = require('express-fileupload');

const connectDB = require('./config/db')


// Load env vars
dotenv.config({ path: "./config/config.env" });

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Mount routers
const api = process.env.API;

app.use(`${api}/bootcamps`, bootcamps);
app.use(`${api}/courses`, courses);
app.use(`${api}/auth`, auth);
app.use(`${api}/users`, users);
app.use(`${api}/reviews`, reviews);

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
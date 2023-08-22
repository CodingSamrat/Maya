// Import packages
require("dotenv").config();
const express = require("express");
const home = require("./routes/home");
const start = require("./routes/start");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/", home);
app.use("/start", start);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));

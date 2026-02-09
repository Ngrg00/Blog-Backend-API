const express = require("express");
const connectionDB = require("./config/dbConnection");
const dotenv = require("dotenv")
dotenv.config();

connectionDB();

const app = express();
const port = process.env.PORT || 5000;

app.use("/", (req, res) => {
    res.send("API is running!!!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
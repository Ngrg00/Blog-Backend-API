const express = require("express");
const app = express();

const port = 5000;

app.use("/", (req, res) => {
    res.send("API is running!!!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
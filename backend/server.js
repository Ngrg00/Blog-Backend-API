const express = require("express");
const connectionDB = require("./config/dbConnection");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler.js");
dotenv.config();

connectionDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/", require("./routes/userRoute.js"));
app.use("/post", require("./routes/postRoute.js"));
app.use("/post", require("./routes/commentRoute.js"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
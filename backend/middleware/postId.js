const mongoose = require("mongoose");

const postId = (req, res, next) => {
    req.postId = new mongoose.Types.ObjectId();
    next();
};

module.exports = { postId };
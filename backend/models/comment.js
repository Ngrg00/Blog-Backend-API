const mongoose = require("mongoose");

const comment = mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        }, 

        post_id: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: "Post"
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }, 

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Comment", comment);
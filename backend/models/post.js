const mongoose = require("mongoose");

const postModel = mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please enter the content of your post."]
        },

        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }, 

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    }, 

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postModel);
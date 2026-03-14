const mongoose = require("mongoose");

const postModel = mongoose.Schema(
    {
        content: {
            type: String,
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
        ],

        imgs: [
            {
                type: String,
            }
        ]
    }, 

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postModel);
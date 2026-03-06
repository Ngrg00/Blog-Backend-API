const mongoose = require("mongoose");

const userModel = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter a username."]
        },

        email: {
            type: String,
            required: [true, "Please enter an email."],
            unique: [true, "Email address already taken."]
        },

        password: {
            type: String,
            required: [true, "Please enter a password."]
        },

        bio: {
            type: String
        },

        profileIcon: {
            initial: { type: String, required: true },
            color: { type: String, required: true }
        }, 

        profilePic: {
            type: String
        }, 

        profileBackground: {
            type: String
        }
    }, 

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userModel);
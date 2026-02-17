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
        }
    }, 

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userModel);
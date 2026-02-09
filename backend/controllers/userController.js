const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        res.status(400);

        throw new Error("All fields are required!");
    }

    const avaliableUser = await User.findOne({ email }); 

    if(avaliableUser) {
        res.status(400);

        throw new Error("Email address already exist!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    if(user) {
        res.status(201).json({ id: user.id, email: user.email });

    } else {
        res.status(400);

        throw new Error("Data is not valid.");
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400);

        throw new Error("All fields are required!");
    }

    const user = await User.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN, { expiresIn: "60m" });

        res.status(200).json(accessToken);
    } else {
        res.status(401);

        throw new Error("Email or password is not valid.");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { register, login, currentUser }
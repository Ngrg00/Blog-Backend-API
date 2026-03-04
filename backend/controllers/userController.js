const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

const register = asyncHandler(async (req, res) => {
    const { username, email, password, profileIcon } = req.body;

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
        password: hashedPassword,
        profileIcon,
        profilePic,
        profileBackground
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

        res.status(200).json({ accessToken, user: { id: user.id, username: user.username, email: user.email } });
    } else {
        res.status(401);

        throw new Error("Email or password is not valid.");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if(!user) {
        res.status(404);

        throw new Error("User not found!");
    }

    res.json(user);
});

const searchUser = asyncHandler(async (req, res) => {
    const keyword = req.query.q; 

    if(!keyword) {
        return res.json([]);
    }

    const user = await User.find(
        { username: 
            { $regex: `^${keyword}`, $options: "i" }
        }
    );

    res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if(!user) {
        res.status(404);

        throw new Error("User not found!");
    }

    if(req.body.username) user.username = req.body.username;
    if(req.body.email) user.email = req.body.email;

    if(req.files.profilePic) user.profilePic = req.files.profilePic[0].path;
    if(req.files.profileBackground) user.profileBackground= req.files.profileBackground[0].path;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
})

module.exports = { register, login, currentUser, getUser, searchUser, updateProfile }
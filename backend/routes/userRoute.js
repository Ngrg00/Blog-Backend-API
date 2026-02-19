const express = require("express");
const validateToken = require("../middleware/validateToken.js");
const router = express.Router();

const {
    register,
    login,
    currentUser,
    getUser,
    searchUser
} = require("../controllers/userController.js");

router.post("/register", register);
router.post("/login", login);
router.get("/current", validateToken, currentUser);
router.get("/search", validateToken, searchUser);
router.get("/:id", validateToken, getUser);

module.exports = router;
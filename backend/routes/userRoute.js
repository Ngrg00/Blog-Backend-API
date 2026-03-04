const express = require("express");
const validateToken = require("../middleware/validateToken.js");
const upload = require("../middleware/uploadImg.js");

const router = express.Router();

const {
    register,
    login,
    currentUser,
    getUser,
    searchUser,
    updateProfile
} = require("../controllers/userController.js");

router.post("/register", register);
router.post("/login", login);
router.get("/current", validateToken, currentUser);
router.get("/search", validateToken, searchUser);
router.get("/:id", validateToken, getUser);
router.put("/update", 
    validateToken, 
    upload.fields([
        { name: "profilePic", maxCount: 1 },
        { name: "profileBackground", maxCount: 1 }
    ]),
    updateProfile);
    
module.exports = router;
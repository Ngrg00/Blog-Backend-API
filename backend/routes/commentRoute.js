const express = require("express");
const validateToken = require("../middleware/validateToken.js");
const router = express.Router();

const {
    addComment
} = require("../controllers/commentController.js");

router.use(validateToken);

router.post("/:id/add-comment", addComment);

module.exports = router;
const express = require("express");
const validateToken = require("../middleware/validateToken.js");

const router = express.Router();

const {
    getPosts,
    getMyPosts,
    getUserPost,
    getPost,
    createPost,
    editPost,
    deletePost
} = require("../controllers/postController.js");

router.use(validateToken);

router.get("/", getPosts);
router.get("/me", getMyPosts);
router.get("/:id/post", getUserPost)
router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", editPost);
router.delete("/:id", deletePost);

module.exports = router;
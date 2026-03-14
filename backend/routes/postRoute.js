const express = require("express");
const validateToken = require("../middleware/validateToken.js");

const { postId } = require("../middleware/postId.js")
const upload = require("../middleware/uploadImg.js");
const {
    getPosts,
    getMyPosts,
    getUserPost,
    getPost,
    createPost,
    editPost,
    deletePost
} = require("../controllers/postController.js");

const router = express.Router();

router.use(validateToken);

router.get("/", getPosts);
router.get("/me", getMyPosts);
router.get("/:id/post", getUserPost)
router.post("/", postId, upload.array("imgs"), createPost);
router.get("/:id", getPost);
router.put("/:id", editPost);
router.delete("/:id", deletePost);

module.exports = router;
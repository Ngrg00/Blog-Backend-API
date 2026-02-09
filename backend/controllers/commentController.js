const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment.js");
const Post = require("../models/post.js");

const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if(!text) {
        res.status(400);

        throw new Error("Comment text is required.");
    }

    const post = await Post.findById(req.params.id);

    if(!post) {
        res.status(404);

        throw new Error("Post was not found.");
    }

    const comment = await Comment.create({
        text,
        post_id: post._id,
        author_id: req.user.id
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(200).json(comment);
});

module.exports = { addComment }
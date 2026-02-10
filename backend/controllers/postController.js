const asyncHandler = require("express-async-handler");
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");

const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate("author_id", "username")
        .populate({
            path: "comments",
            populate: { path: "author_id", select: "username" }
        })
        .sort({ createdAt: 1 });
    
    res.status(200).json(posts);
});

const getMyPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ author_id: req.user.id })
        .populate("author_id", "username")
        .populate({
            path: "comments",
            populate: { path: "author_id", select: "username" }
        })
        .sort({ createdAt: 1 });

    res.status(200).json(posts);
});

const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if(!title || !content) {
        res.status(400);

        throw new Error("All fields are required.");
    }

    const post = await Post.create({
        title,
        content,
        author_id: req.user.id,
    });

    res.status(200).json(post);
});

const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate("author_id", "username")
        .populate({
            path: "comments",
            populate: { path: "author_id", select: "username" }
        })
        .sort({ createdAt: 1 });

    if(!post) {
        res.status(404);

        throw new Error("Post was not found.");
    }

    res.status(200).json(post);
});

const editPost = asyncHandler(async (req,res) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
        res.status(404);

        throw new Error("Post was not found.");
    }

    if(post.author_id.toString() !== req.user.id) {
        res.status(403);

        throw new Error("User does not have the permission to edit this post.");
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
        .populate("author_id", "username")
        .populate({
            path: "comments",
            populate: { path: "author_id", select: "username" }
        })
        .sort({ createdAt: 1 }); 

    res.status(200).json(updatedPost);
}); 

const deletePost = asyncHandler(async (req,res) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
        res.status(404);

        throw new Error("Post was not found.");
    }

    if(post.author_id.toString() !== req.user.id) {
        res.status(403);

        throw new Error("User doesn't have permission to delete other user contacts.");
    }

    await Post.findByIdAndDelete(post);

    res.status(200).json(post);
});

module.exports = { getPosts, getMyPosts, createPost, getPost, editPost, deletePost }

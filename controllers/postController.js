const Post = require("../models/postModel");


exports.getAllPosts = async (req, res, next) => {

    try {
        const posts = await Post.find();
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: { posts }
        })
    } catch (error) {
        console.log("err ", error);
        res.status(400).json({
            status: "failed"
        })
    }
}

exports.getOnePost = async (req, res, next) => {
    try {
        const posts = await Post.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: { posts }
        })
    } catch (error) {
        res.status(400).json({
            status: "failed"
        })
    }
}

exports.createpost = async (req, res, next) => {
    try {
        const posts = await Post.create(req.body);

        res.status(200).json({
            status: "success",
            data: { posts }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "failed"
        })
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const posts = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.status(200).json({
            status: "success",
            data: { posts }
        })
    } catch (error) {
        res.status(400).json({
            status: "failed"
        })
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const posts = await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
        })
    } catch (error) {
        res.status(400).json({
            status: "failed"
        })
    }
}
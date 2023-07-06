// import * as postService from '../services/post.js';
const QueryString = require('qs');
const Post = require('../models/Post');

const read = async (req, res, next) => {
    try {
        let posts;
        posts = await Post.aggregate([{ $match: req.filters }, { $sort: req.sorts }]);
        return res.status(200).json({ success: true, posts });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let post;
        post = await Post.findOne({ _id: id });
        return res.status(200).json({ success: true, post });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Insternal server error ' + id });
    }
};
const create = async (req, res, next) => {
    const { title, content, categoryId } = req.body;

    // Validate field
    if (!title || !content || !categoryId) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        const newPost = new Post({
            title,
            content,
            categoryId,
        });
        await newPost.save();
        return res.status(201).json({ success: true, post: newPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Update post
    try {
        const newPost = await Product.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, post: newPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Post.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const like = async (req, res, next) => {
    try {
        const post = await Post.getById(req.id);

        const newPost = post.likes;
        if (!newPost.includes(req.accountId)) {
            newPost.push(req.accountId);
            post.likes = newPost;
            await post.save();
        }

        await post.populate('likes', 'name');
        return res.status(200).json({ success: true, post: newPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const unlike = async (req, res, next) => {
    try {
        const post = await Post.getById(req.id);

        const newPost = post.likes;
        if (newPost.includes(req.accountId)) {
            newPost.push(req.accountId);
            post.likes = newPost;
            await post.save();
        }

        await post.populate('likes', 'name');
        return res.status(200).json({ success: true, post: newPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const view = async (req, res, next) => {
    try {
        const post = await Post.getById(req.id);

        const newPost = post.view;
        if (!newPost.includes(req.accountId)) {
            newPost.push(req.accountId);
            post.view = newPost;
            await post.save();
        }

        await post.populate('views', 'name');
        return res.status(200).json({ success: true, post: newPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};
const unview = async (req, res, next) => {
    try {
        const post = await Post.getById(req.id);

        const newPost = post.view;
        if (newPost.includes(req.accountId)) {
            newPost.push(req.accountId);
            post.view = newPost;
            await post.save();
        }

        await post.populate('views', 'name');
        return res.status(200).json({ success: true, post: newPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, readOne, create, update, destroy, like, unlike, view, unview };

import Post from '../models/post.js';
import Category from '../models/Category.js';
import Tag from '../models/tag.js';
import Account from '../models/account.js';
import * as imageHandler from '../utils/imageHandler.js';
import { roleNames } from '../../configs/constants.js';

const getPosts = async (options) => {
    try {
        let posts;
        if (options.categoryId) {
            posts = await Post.find({ category: options.categoryId })
                .limit(options.limit)
                .skip((options.page - 1) * options.limit)
                .populate('category')
                .populate('tag', 'name')
                .populate('creator', 'name avatar')
                .populate('numComments')
                .sort({ createdAt: -1 });
        } else {
            posts = await Post.find()
                .limit(options.limit)
                .skip((options.page - 1) * options.limit)
                .populate('category')
                .populate('tag', 'name')
                .populate('creator', 'name avatar')
                .populate('numComments')
                .sort({ createdAt: -1 });
        }

        return posts;
    } catch (err) {
        throw err;
    }
};

const getPost = async (id) => {
    try {
        return await Post.getById(id);
    } catch (err) {
        throw err;
    }
};

const createPost = async ({ title, content, tagId, categoryId, files, accountId }) => {
    try {
        await Account.getById(accountId);
        const category = await Category.getById(categoryId);
        const tag = await Tag.getById(tagId);

        const post = new Post({
            title,
            content,
            tag: tag._id,
            category: category._id,
            creator: accountId,
        });

        // upload images
        const uploadedImages = await imageHandler.uploadMultiple(accountId, post._id, files);
        post.images = uploadedImages;

        await post.save();

        return post;
    } catch (err) {
        throw err;
    }
};

const updatePost = async ({ postId, title, content, tagId, categoryId, files, accountId }) => {
    try {
        const editedPost = await Post.getById(postId);
        await Account.getById(accountId);

        // Check if account is post's creator
        if (accountId.toString() !== editedPost.creator._id.toString()) {
            const error = new Error('Account is not the creator');
            error.statusCode = 403;
            throw error;
        }

        // Check category and tag are existing
        if (categoryId) {
            const category = await Category.getById(categoryId);
            editedPost.category = category._id;
        }

        if (tagId) {
            const tag = await Tag.getById(tagId);
            editedPost.category = tag._id;
        }

        if (Array.from(files).length > 0) {
            // Delete old images
            if (editedPost.images.length > 0) {
                await imageHandler.deleteFolder(imageHandler.path.forPost(accountId, editedPost._id.toString()));
            }

            const uploadedImages = await imageHandler.uploadMultiple(accountId, editedPost._id, files);
            editedPost.images = uploadedImages;
        }

        if (title) {
            editedPost.title = title;
        }

        if (content) {
            editedPost.content = content;
        }

        await editedPost.save();

        return editedPost;
    } catch (err) {
        throw err;
    }
};

const deleteSavedPost = async (postId, accountId) => {
    try {
        const account = await Account.getById(accountId);
        const post = await Post.getById(postId);
        const updatedSavedPosts = account.savedPosts;
        if (updatedSavedPosts.includes(post._id)) {
            account.savedPosts = updatedSavedPosts.filter((p) => p._id.toString() !== post._id.toString());
            await account.save();
        }

        return account;
    } catch (err) {
        throw err;
    }
};

const deletePost = async (postId, accountId) => {
    try {
        const post = await Post.getById(postId);
        const account = await Account.getById(accountId).populate('role');

        // Check if account is post's creator or admin
        if (account._id.toString() !== post.creator._id.toString() && account.role.name !== roleNames.ADMIN) {
            const error = new Error('Account is not the creator or administrator');
            error.statusCode = 403;
            throw error;
        }

        // Delete images
        if (post.images.length > 0) {
            await imageHandler.deleteFolder(imageHandler.path.forPost(accountId, post._id.toString()));
        }

        // Delete post in savedPost of all users
        const allAccounts = await Account.find();
        for (const account of allAccounts) {
            await deleteSavedPost(postId, account._id.toString());
        }

        await Post.findByIdAndDelete(post._id);
    } catch (err) {
        throw err;
    }
};

const likePost = async (postId, accountId) => {
    try {
        const post = await Post.getById(postId);

        const updatedLikes = post.likes;
        if (!updatedLikes.includes(accountId)) {
            updatedLikes.push(accountId);
            post.likes = updatedLikes;
            await post.save();
        }

        await post.populate('likes', 'name');

        return post;
    } catch (err) {
        throw err;
    }
};

const unlikePost = async (postId, accountId) => {
    try {
        const post = await Post.getById(postId);

        let updatedLikes = post.likes;
        if (updatedLikes.includes(accountId)) {
            updatedLikes = updatedLikes.filter((like) => like.toString() !== accountId.toString());
            post.likes = updatedLikes;
            await post.save();
        }

        await post.populate('likes', 'name');

        return post;
    } catch (err) {
        throw err;
    }
};

const viewPost = async (postId, accountId) => {
    try {
        const post = await Post.getById(postId);
        const account = await Account.getById(accountId);

        const updatedViews = post.views;
        if (!updatedViews.includes(account._id.toString())) {
            updatedViews.push(account._id.toString());
            post.views = updatedViews;
            await post.save();
        }

        return post;
    } catch (err) {
        throw err;
    }
};

const savePost = async (postId, accountId) => {
    try {
        const post = await Post.getById(postId);
        const account = await Account.getById(accountId);

        if (!account.savedPosts.includes(post._id.toString())) {
            account.savedPosts.push(post._id.toString());
            await account.save();
        }

        return account;
    } catch (err) {
        throw err;
    }
};

const getSavedPosts = async (accountId) => {
    try {
        const account = await Account.getById(accountId);

        const savedPosts = await Post.find({ _id: { $in: account.savedPosts } })
            .populate('category')
            .populate('tag', 'name')
            .populate('creator', 'name')
            .populate('numComments')
            .sort({ createdAt: -1 });

        return savedPosts;
    } catch (err) {
        throw err;
    }
};

const getFollowingPosts = async (accountId) => {
    try {
        const account = await Account.getById(accountId);

        const following = account.following;
        const followingPosts = await Post.find({
            creator: { $in: following },
        })
            .populate('category')
            .populate('tag', 'name')
            .populate('creator', 'name avatar')
            .populate('numComments')
            .sort({ createdAt: -1 });

        return followingPosts;
    } catch (err) {
        throw err;
    }
};

export {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    viewPost,
    savePost,
    deleteSavedPost,
    getSavedPosts,
    getFollowingPosts,
};

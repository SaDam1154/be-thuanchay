const QueryString = require('qs');
const Product = require('../models/Product');
const User = require('../models/User');
const imageToolkit = require('../utils/imageToolkit');

// [GET] api/product
const read = async (req, res, next) => {
    try {
        let products;
        products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categ`ories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            { $match: req.filters },
            { $sort: req.sorts },
        ]);
        return res.status(200).json({ success: true, products });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/product
const create = async (req, res, next) => {
    const { name, price, priceDiscount, isDiscounted, description, category, quantity, image } = req.body;
    // Validate field
    if (!name || !price || !category) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    // upload image
    let imageResult;
    if (image) {
        try {
            imageResult = await imageToolkit.upload(image);
            if (!imageResult) {
                return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
            }
        } catch (err) {
            return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
        }
    }

    try {
        const newProduct = new Product({
            name,
            price,
            priceDiscount,
            isDiscounted,
            description,
            category,
            quantity,
            image: image && imageResult.secure_url,
        });
        await newProduct.save();
        return res.status(201).json({ success: true, product: newProduct });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/product/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let product;
        product = await Product.findOne({ id }).populate('category');
        return res.status(200).json({ success: true, product });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/product/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Upload image
    if (updateObj.image) {
        let imageResult;
        try {
            imageResult = await imageToolkit.upload(updateObj.image);
            if (!imageResult) {
                console.log(err);
                return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
        }
        updateObj.image = imageResult.secure_url || 'https://picsum.photos/200/300';
    }

    // Update product
    try {
        const newProduct = await Product.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, product: newProduct });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/product/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Product.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const save = async (req, res, next) => {
    try {
        const { productId, userId } = req.body;

        let product = await Product.findOne({ productId });

        let user = await User.findOne({ userId });
        if (!user.wishList.includes(product._id.toString())) {
            user.wishList.push(product._id.toString());
            await user.save();
        }
        return res.status(201).json({ success: true, user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};
const unsave = async (req, res, next) => {
    try {
        const { productId, userId } = req.body;

        let product = await Product.findOne({ productId });

        let user = await User.findOne({ userId });
        if (user.wishList.includes(product._id.toString())) {
            user.wishList.push(product._id.toString());
            await user.save();
        }
        return res.status(201).json({ success: true, user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const getSavedProducts = async (req, res, next) => {
    const { userId } = req.body;
    try {
        let user = await User.findById(userId);
        let wishList = await Product.find({ _id: { $in: user.wishList } });
        return res.status(200).json({ success: true, wishList });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const favourite = async (req, res, next) => {
    try {
        const { productId, userId } = req.body;

        let product = await Product.findOne({ productId });

        let user = await User.findOne({ userId });
        if (!user.favouriteList.includes(product._id.toString())) {
            user.favouriteList.push(product._id.toString());
            await user.favourite();
        }
        return res.status(201).json({ success: true, user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};
const unfavourite = async (req, res, next) => {
    try {
        const { productId, userId } = req.body;

        let product = await Product.findOne({ productId });

        let user = await User.findOne({ userId });
        if (user.favouriteList.includes(product._id.toString())) {
            user.favouriteList.push(product._id.toString());
            await user.favourite();
        }
        return res.status(201).json({ success: true, user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

const getFavouritedProducts = async (req, res, next) => {
    const { userId } = req.body;
    try {
        let user = await User.findById(userId);
        let favouriteList = await Product.find({ _id: { $in: user.favouriteList } });
        return res.status(200).json({ success: true, favouriteList });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = {
    read,
    create,
    readOne,
    update,
    destroy,
    save,
    unsave,
    getSavedProducts,
    favourite,
    unfavourite,
    getFavouritedProducts,
};

const QueryString = require('qs');
const Text = require('../models/Text');
const imageToolkit = require('../utils/imageToolkit');

// [GET] api/text
const read = async (req, res, next) => {
    try {
        let products;
        products = await Text.aggregate([
            {
                $lookup: {
                    from: 'product_types',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'type',
                },
            },
            {
                $unwind: '$type',
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

// [POST] api/text
const create = async (req, res, next) => {
    const { name } = req.body;
    // Validate field
    if (!name) {
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
        const newProduct = new Text({
            name,
        });
        await newProduct.save();
        return res.status(201).json({ success: true, text: newProduct });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/text/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let text;
        text = await Text.findOne({ id }).populate('type');
        return res.status(200).json({ success: true, text });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/text/:id
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

    // Update text
    try {
        const newProduct = await Text.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, text: newProduct });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/text/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Text.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy };

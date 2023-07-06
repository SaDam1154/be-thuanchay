const ProductType = require('../models/ProductType');

// [GET] api/productType
const read = async (req, res, next) => {
    try {
        let productTypes;
        productTypes = await ProductType.aggregate([{ $match: req.filters }, { $sort: req.sorts }]);
        return res.status(200).json({ success: true, productTypes });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/product-type
const create = async (req, res, next) => {
    const { name } = req.body;

    // Validate field
    if (!name) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        const newProductType = new ProductType({
            name,
        });
        await newProductType.save();
        return res.status(201).json({ success: true, productType: newProductType });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/product-type/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let productType;
        productType = await ProductType.findOne({ id });
        return res.status(200).json({ success: true, productType });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/product-type/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Update productType
    try {
        const newProductType = await ProductType.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, productType: newProductType });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/product-type/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await ProductType.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy };

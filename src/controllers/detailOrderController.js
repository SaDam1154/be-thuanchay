const { default: mongoose } = require('mongoose');
const DetailOrder = require('../models/DetailOrder');

// [GET] api/detailOrder
const read = async (req, res, next) => {
    try {
        let detailOrders;
        detailOrders = await DetailOrder.aggregate([{ $match: req.filters }, { $sort: req.sorts }]);
        return res.status(200).json({ success: true, detailOrders });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/detailOrder
const findByOrderId = async (req, res, next) => {
    const id = req.params.id;
    try {
        let detailOrders;
        detailOrders = await DetailOrder.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $unwind: '$product',
            },
            {
                $match: {
                    order: mongoose.Types.ObjectId(id),
                },
            },
            { $sort: req.sorts },
        ]);
        return res.status(200).json({ success: true, detailOrders });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/detail-order
const create = async (req, res, next) => {
    const { name } = req.body;

    // Validate field
    if (!name) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        const newDetailOrder = new DetailOrder({
            name,
        });
        await newDetailOrder.save();
        return res.status(201).json({ success: true, detailOrder: newDetailOrder });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/detail-order/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let detailOrder;
        detailOrder = await DetailOrder.findOne({ id });
        return res.status(200).json({ success: true, detailOrder });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/detail-order/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Update detailOrder
    try {
        const newDetailOrder = await DetailOrder.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, detailOrder: newDetailOrder });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/detail-order/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await DetailOrder.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy, findByOrderId };

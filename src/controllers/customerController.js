const Customer = require('../models/Customer');

// [GET] api/customer
const read = async (req, res, next) => {
    try {
        let customers;
        customers = await Customer.aggregate([{ $match: req.filters }, { $sort: req.sorts }]);
        return res.status(200).json({ success: true, customers });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/customer
const create = async (req, res, next) => {
    const { name, address, phone } = req.body;

    // Validate field
    if (!name || !address || !phone) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        const newCustomer = new Customer({ name, address, phone });
        await newCustomer.save();
        return res.status(201).json({ success: true, customer: newCustomer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/customer/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let customer;
        customer = await Customer.findOne({ id });
        return res.status(200).json({ success: true, customer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/customer/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};
    console.log(bodyObj);

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Update customer
    try {
        const newCustomer = await Customer.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, customer: newCustomer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/customer/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Customer.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy };

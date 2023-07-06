const Review = require('../models/Review');

// [GET] api/review
const read = async (req, res, next) => {
    try {
        let reviews;
        reviews = await Review.aggregate([{ $match: req.filters }, { $sort: req.sorts }]);
        return res.status(200).json({ success: true, reviews });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/review
const create = async (req, res, next) => {
    const { product, user, rating, comment } = req.body;

    // Validate field
    if (!product || !user || !rating || !comment) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        const newReview = new Review({
            product,
            user,
            rating,
            comment,
        });
        await newReview.save();
        return res.status(201).json({ success: true, review: newReview });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/review/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let review;
        review = await Review.findOne({ id });
        return res.status(200).json({ success: true, review });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/review/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Update review
    try {
        const newReview = await Review.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, review: newReview });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/review/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Review.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy };

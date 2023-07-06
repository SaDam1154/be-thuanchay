const User = require('../models/User');
const argon2 = require('argon2');

// [GET] api/user
const read = async (req, res, next) => {
    try {
        let users;
        users = await User.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role',
                },
            },
            {
                $unwind: '$role',
            },
            { $match: req.filters },
            { $sort: req.sorts },
        ]);
        return res.status(200).json({ success: true, users });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/user
const create = async (req, res, next) => {
    const { username, name, phone, address, password, role } = req.body;
    // Validate field
    if (!name || !username || !password || !role || !phone || !address) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        // check exist user
        let user;
        user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ success: false, status: 401, message: 'email already exists' });
        }

        const hash = await argon2.hash(password);
        const newAccount = new Account({
            username,
            name,
            phone,
            address,
            password: hash,
            role,
            phone,
            gender,
            dateOfBirth,
            urlAvt,
        });
        await newUser.save();
        return res.status(201).json({ success: true, user: newUser });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/user/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let user;
        user = await User.findOne({ id }).populate('role');
        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/user/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};

    try {
        if (bodyObj.password) {
            bodyObj.password = await argon2.hash(bodyObj.password);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Update user
    try {
        const newUser = await User.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, user: newUser });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/user/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await User.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy };

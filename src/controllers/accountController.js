const Account = require('../models/Account');
const argon2 = require('argon2');

// [GET] api/account
const read = async (req, res, next) => {
    try {
        let accounts;
        accounts = await Account.aggregate([
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
        return res.status(200).json({ success: true, accounts });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/account
const create = async (req, res, next) => {
    const { username, name, phone, address, email, password, role } = req.body;
    // Validate field
    if (!name || !username || !password || !role) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        // check exist account
        let account;
        account = await Account.findOne({ username });
        if (account) {
            return res.status(401).json({ success: false, status: 401, message: 'username already exists' });
        }

        const hash = await argon2.hash(password);
        const newAccount = new Account({
            username,
            name,
            email,
            password: hash,
            role,
        });
        await newAccount.save();
        return res.status(201).json({ success: true, account: newAccount });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/account/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let account;
        account = await Account.findOne({ id }).populate('role');
        return res.status(200).json({ success: true, account });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/account/:id
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

    // Update account
    try {
        const newAccount = await Account.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, account: newAccount });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/account/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Account.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy };

const Account = require('../models/Account');
const argon2 = require('argon2');
const Permission = require('../models/Permission');

// [POST] api/auth/login
const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        let account;
        account = await Account.findOne({ username }).populate('role');
        if (!account) {
            return res.status(401).json({ success: false, status: 401, message: 'username incorrect' });
        }

        if (!(await argon2.verify(account.password, password))) {
            return res.status(401).json({ success: false, status: 401, message: 'password incorrect' });
        }

        const role = account.toObject().role._id;

        // Get function
        let permissions;
        permissions = await Permission.find({ role }).populate('function');

        const functions = permissions.map((permission) => {
            return permission.toObject().function;
        });

        return res.status(200).json({ success: true, account: { ...account.toObject(), functions } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { login };

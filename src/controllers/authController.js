const User = require('../models/User');
const argon2 = require('argon2');
const Permission = require('../models/Permission');

// [POST] api/auth/login
const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        let user;
        user = await User.findOne({ email }).populate('role');
        if (!user) {
            return res.status(401).json({ success: false, status: 401, message: 'email incorrect' });
        }

        if (!(await argon2.verify(user.password, password))) {
            return res.status(401).json({ success: false, status: 401, message: 'password incorrect' });
        }

        const role = user.toObject().role._id;

        // Get function
        let permissions;
        permissions = await Permission.find({ role }).populate('function');

        const functions = permissions.map((permission) => {
            return permission.toObject().function;
        });

        return res.status(200).json({ success: true, user: { ...user.toObject(), functions } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { login };

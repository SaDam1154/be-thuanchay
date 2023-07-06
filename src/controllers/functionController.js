const Function = require('../models/Function');

// [GET] api/function
const read = async (req, res, next) => {
    try {
        let functions;
        functions = await Function.aggregate([{ $match: req.filters }, { $sort: { index: 1 } }]);
        return res.status(200).json({ success: true, functions });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read };

const parseSorts = async (req, res, next) => {
    let sorts = req.query.sorts;

    if (sorts) {
        req.sorts = JSON.parse(sorts);
    } else {
        req.sorts = { id: 1 };
    }
    next();
};

module.exports = parseSorts;

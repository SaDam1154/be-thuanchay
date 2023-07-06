const parseFilters = async (req, res, next) => {
    let filters = req.query.filters;

    if (filters) {
        req.filters = JSON.parse(filters);
    } else {
        req.filters = {};
    }
    next();
};

module.exports = parseFilters;

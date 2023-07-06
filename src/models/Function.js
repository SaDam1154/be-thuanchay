const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunctionSchema = new Schema({
    index: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('functions', FunctionSchema);

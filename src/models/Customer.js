const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

CustomerSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
CustomerSchema.plugin(AutoIncrement, { id: 'customers', inc_field: 'id' });

module.exports = mongoose.model('customers', CustomerSchema);

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'customers',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        totalPrice: {
            type: Number,
        },
        receivedMoney: {
            type: Number,
        },
        exchangeMoney: {
            type: Number,
        },
        discount: {
            type: Number,
        },
        tax: {
            type: Number,
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'done', 'cancle'],
        },
    },
    {
        timestamps: true,
    }
);

OrderSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
OrderSchema.plugin(AutoIncrement, { id: 'orders', inc_field: 'id' });

module.exports = mongoose.model('orders', OrderSchema);

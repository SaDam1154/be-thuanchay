const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const DetailOrderSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'orders',
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
        },
        quantity: {
            type: Number,
            require: true,
            default: 1,
        },
        price: {
            type: Number,
            require: true,
        },
        totalPrice: {
            type: Number,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

DetailOrderSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
DetailOrderSchema.plugin(AutoIncrement, { id: 'detail_orders', inc_field: 'id' });

module.exports = mongoose.model('detail_orders', DetailOrderSchema);

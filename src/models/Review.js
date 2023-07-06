const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'products',
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        rating: {
            type: Number,
            unique: true,
        },
        comment: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

ReviewSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
ReviewSchema.plugin(AutoIncrement, { id: 'reviews', inc_field: 'id' });

module.exports = mongoose.model('reviews', ReviewSchema);

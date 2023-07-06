const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
categorySchema.plugin(AutoIncrement, { id: 'Category', inc_field: 'id' });

module.exports = mongoose.model('Category', categorySchema);

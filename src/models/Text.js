const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const TextSchema = new Schema(
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

TextSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
TextSchema.plugin(AutoIncrement, { id: 'texts', inc_field: 'id' });

module.exports = mongoose.model('texts', TextSchema);

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        username: {
            type: String,
            required: true,
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
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'roles',
        },
    },
    {
        timestamps: true,
    }
);

AccountSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
AccountSchema.plugin(AutoIncrement, { id: 'accounts', inc_field: 'id' });

module.exports = mongoose.model('accounts', AccountSchema);

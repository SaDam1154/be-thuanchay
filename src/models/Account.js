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
        email: {
            type: String,
        },
        name: {
            type: String,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
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

const mongoose = require('mongoose');
const DEFAULT_AVATAR_URL = 'https://simulacionymedicina.es/wp-content/uploads/2015/11/default-avatar-300x300-1.jpg';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'roles',
        },
        phone: {
            type: String,
        },
        gender: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
            default: '2000/01/01',
        },
        urlAvt: {
            type: String,
            default: DEFAULT_AVATAR_URL,
        },
        wishList: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        favouriteList: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
UserSchema.plugin(AutoIncrement, { id: 'users', inc_field: 'id' });

module.exports = mongoose.model('users', UserSchema);

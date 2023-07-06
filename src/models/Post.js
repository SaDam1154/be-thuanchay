const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Post = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Account',
            },
        ],
        views: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Account',
            },
        ],
    },
    {
        timestamps: true,
    }
);

Post.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
Post.plugin(AutoIncrement, { id: 'posts', inc_field: 'id' });

module.exports = mongoose.model('posts', Post);

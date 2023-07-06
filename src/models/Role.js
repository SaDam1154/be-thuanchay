const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

RoleSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
RoleSchema.plugin(AutoIncrement, { id: 'roles', inc_field: 'id' });

module.exports = mongoose.model('roles', RoleSchema);

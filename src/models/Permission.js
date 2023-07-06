const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema(
    {
        function: {
            type: Schema.Types.ObjectId,
            ref: 'functions',
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

module.exports = mongoose.model('permissions', PermissionSchema);

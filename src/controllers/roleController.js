const Role = require('../models/Role');
const Permission = require('../models/Permission');
const Function = require('../models/Function');

// [GET] api/role
const read = async (req, res, next) => {
    try {
        let roles;
        roles = await Role.aggregate([{ $match: req.filters }, { $sort: req.sorts }]);
        return res.status(200).json({ success: true, roles });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/role
const create = async (req, res, next) => {
    const { name, description, functions } = req.body;
    // Validate field
    if (!name) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        const role = new Role({
            name,
            description,
        });
        await role.save();

        // Have functions --> update permission
        let createPermissionPromises = undefined;
        if (functions) {
            createPermissionPromises = functions.map(
                (funcId) =>
                    new Promise(async (resolve, reject) => {
                        try {
                            const newPermission = new Permission({
                                role: role.toObject()._id,
                                function: funcId,
                            });
                            await newPermission.save();
                            resolve(newPermission);
                        } catch (error) {
                            console.log(error);
                            reject();
                        }
                    })
            );
        }
        if (createPermissionPromises) {
            await Promise.all(createPermissionPromises);
        }

        // Get function
        let permissions;
        permissions = await Permission.find({ role: role.toObject()._id }).populate('function');

        let funcs;
        funcs =
            permissions?.map((permission) => {
                return permission.toObject().function;
            }) || null;

        return res.status(201).json({ success: true, role: { ...role.toObject(), functions: funcs } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/role/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let role;
        role = await Role.findOne({ id });

        // Get function
        let permissions;
        permissions = await Permission.find({ role: role.toObject()._id }).populate('function');

        const functions = permissions.map((permission) => {
            return permission.toObject().function;
        });

        return res.status(200).json({ success: true, role: { ...role.toObject(), functions } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/role/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const { name, description, functions } = req.body;

    const updateObj = {};
    if (name) {
        updateObj.name = name;
    }
    if (description) {
        updateObj.description = description;
    }

    // Update role
    try {
        const role = await Role.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });

        // Have functions --> update permission
        let createPermissionPromises = undefined;
        if (functions) {
            // Delete old permission
            await Permission.deleteMany({ role: role.toObject()._id });

            createPermissionPromises = functions.map(
                (funcId) =>
                    new Promise(async (resolve, reject) => {
                        try {
                            const newPermission = new Permission({
                                role: role.toObject()._id,
                                function: funcId,
                            });
                            await newPermission.save();
                            resolve(newPermission);
                        } catch (error) {
                            console.log(error);
                            reject();
                        }
                    })
            );
        }
        if (createPermissionPromises) {
            await Promise.all(createPermissionPromises);
        }

        // Get function
        let permissions;
        permissions = await Permission.find({ role: role.toObject()._id }).populate('function');

        let funcs;
        funcs =
            permissions?.map((permission) => {
                return permission.toObject().function;
            }) || null;

        return res.status(200).json({ success: true, role: { ...role.toObject(), functions: funcs } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/role/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Role.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy };

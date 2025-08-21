import { Handler, NextFunction } from "express";
import { HttpError } from "../errors/HttpError.js";
import { createRoleSchema, updateUserRoleSchema } from "../schemas/authSchema.js";
import { AdminModel } from "../models/adminModel.js";

const adminModel = new AdminModel();
class AdminController {
    // POST /api/admin/create-role
    createRole: Handler = async (req, res, next: NextFunction) => {
        if (!req.body) throw new HttpError(400, "No Body Req");

        try {
            const validatedData = createRoleSchema.parse(req.body);
            const newRole = await adminModel.createRole(validatedData.name, validatedData.description);

            return res.status(201).json(newRole);
        } catch (e) {
            next(e);
        }
    }

    // GET /api/admin/dashboard/users
    getUsers: Handler = async (req, res, next: NextFunction) => {
        try {
            const users = await adminModel.getAllUsers();

            return res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    // POST /api/admin/dashboard/update-user-role
    updateUserRole: Handler = async (req, res, next: NextFunction) => {
        if (!req.body) throw new HttpError(400, "No body req");

        try {
            const validatedData = updateUserRoleSchema.parse(req.body);
            const updatedUser = await adminModel.updateRole(validatedData.userId, validatedData.newRole);

            return res.status(200).json(updatedUser);
        } catch (e) {
            next(e);
        }
    }
}

export { AdminController };


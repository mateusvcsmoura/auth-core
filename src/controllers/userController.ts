import { Handler, NextFunction } from "express";
import { HttpError } from "../errors/HttpError.js";
import { changeUserPasswordSchema, loginUserSchema, registerUserSchema } from "../schemas/authSchema.js";
import { UserModel } from "../models/userModel.js";

const userModel = new UserModel();
class UserController {
    // /api/user/register
    register: Handler = async (req, res, next: NextFunction) => {
        if (!req.body) throw new HttpError(400, "No body req");

        try {
            const validatedData = registerUserSchema.parse(req.body);

            const newUser = await userModel.register(validatedData);
            if (!newUser) throw new HttpError(500, "Could not create user");

            return res.status(201).json(newUser);
        } catch (e) {
            next(e);
        }
    }

    // /api/user/login
    login: Handler = async (req, res, next: NextFunction) => {
        if (!req.body) throw new HttpError(400, "No body req");

        try {
            const validatedData = loginUserSchema.parse(req.body);
            const token = await userModel.login(validatedData);

            return res.status(200).json({ token });
        } catch (e) {
            next(e);
        }
    }

    // /api/user/change-password
    changePassword: Handler = async (req, res, next: NextFunction) => {
        if (!req.body) throw new HttpError(400, "No body req");

        try {
            const validatedData = changeUserPasswordSchema.parse(req.body);
            const id = req.user?.id as number;

            const updatedUser = await userModel.changePassword({ ...validatedData, id });

            return res.status(200).json(updatedUser);
        } catch (e) {
            next(e);
        }
    }

    // /api/user/delete-account
    deleteAccount: Handler = async (req, res, next: NextFunction) => {
        if (!req.user) throw new HttpError(401, "Authorization required");

        try {
            const deletedUser = await userModel.deleteAccount(req.user); // delete current user account

            return res.status(200).json(deletedUser);
        } catch (e) {
            next(e);
        }
    }
};

export { UserController };


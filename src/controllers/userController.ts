import { Handler, NextFunction } from "express";
import { HttpError } from "../errors/HttpError.js";
import { loginUserSchema, registerUserSchema } from "../schemas/authSchema.js";
import { UserModel } from "../models/userModel.js";

const userModel = new UserModel();
class UserController {
    register: Handler = async (req, res, next: NextFunction) => {
        if (!req.body) throw new HttpError(400, "No body req");

        try {
            const validatedData = registerUserSchema.parse(req.body);

            const newUser = await userModel.register(validatedData);
            if (!newUser) throw new HttpError(500, "Could not create user");

            return res.status(201).json({ ...newUser, password: undefined });
        } catch (e) {
            next(e);
        }
    }

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
};

export { UserController };


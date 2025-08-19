import { Handler } from "express";
import { HttpError } from "../errors/HttpError.js";
import z from "zod";
import { registerUserSchema } from "../schemas/authSchema.js";
import { UserModel } from "../models/userModel.js";

const userModel = new UserModel();

class UserController {
    register: Handler = async (req, res) => {
        if (!req.body) throw new HttpError(400, "No body req");

        try {
            const validatedData = registerUserSchema.parse(req.body);

            const existingUser = await userModel.getUserByEmail(validatedData.email);
            if (existingUser) throw new HttpError(409, "E-mail already in use");

            const newUser = await userModel.register(validatedData);
            if (!newUser) throw new HttpError(500, "Could not create user");

            return res.status(201).json(newUser);
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ message: "Invalid Data Format", errors: e.issues })
            }

            if (e instanceof HttpError) {
                return res.status(e.status).json({ message: e.message });
            }

            return res.status(500).json({ message: "Internal server errors" });
        }
    }
};

export { UserController };


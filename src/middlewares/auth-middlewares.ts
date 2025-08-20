import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import { HttpError } from '../errors/HttpError.js';
import { CustomJwtPayload } from '../interfaces/auth-interfaces.js';
import { UserModel } from '../models/userModel.js';
config();

const middlewares = {
    ensureAuth: async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) throw new HttpError(401, "Authorization required");

        const token = authHeader.split(" ")[1];

        try {
            const secret = process.env.JWT_SECRET!;
            const decoded = jwt.verify(token, secret) as CustomJwtPayload;

            const { email } = decoded;
            const userModel = new UserModel();
            const user = await userModel.getUserByEmail(email);

            if (!user) throw new HttpError(404, "User not found");

            (req as any).user = user; // save user in req obj

            next();
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                throw new HttpError(401, "Invalid token");
            }

            throw e;
        }
    }
};

export { middlewares };


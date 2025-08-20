import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../errors/HttpError.js';
import { CustomJwtPayload } from '../interfaces/auth-interfaces.js';
import { UserModel } from '../models/userModel.js';
import { JWT_SECRET } from '../config/index.js';

const middlewares = {
    ensureAuth: async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) throw new HttpError(401, "Authorization required");

        const token = authHeader.split(" ")[1];

        try {
            const secret = JWT_SECRET;
            const decoded = jwt.verify(token, secret) as CustomJwtPayload;

            const userModel = new UserModel();
            const user = await userModel.getUserAsPayload(decoded.id);
            if (!user) throw new HttpError(404, "User not found");

            req.user = user; // save user in req

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


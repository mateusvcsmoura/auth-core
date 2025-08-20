import * as express from 'express';
import { CustomJwtPayload } from '../interfaces/auth-interfaces.ts';

declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload; // save user type in request
        }
    }
}

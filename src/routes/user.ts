import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { middlewares } from "../middlewares/auth-middlewares.js";

const userRouter = Router();
const userController = new UserController();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/change-password', middlewares.ensureAuth, userController.changePassword);
userRouter.delete('/delete-account', middlewares.ensureAuth, userController.deleteAccount);

export { userRouter };

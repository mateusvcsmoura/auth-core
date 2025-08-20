import { Router } from "express";
import { AdminController } from "../controllers/adminController.js";
import { middlewares } from "../middlewares/auth-middlewares.js";

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.post('/create-role', adminController.createRole);
adminRouter.get('/dashboard/users', middlewares.ensureAuth, middlewares.ensureAdmin, adminController.getUsers);

export { adminRouter };
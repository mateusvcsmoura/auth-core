import { Router } from "express";
import { AdminController } from "../controllers/adminController.js";
import { middlewares } from "../middlewares/auth-middlewares.js";

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.post('/create-role', adminController.createRole);
adminRouter.get('/dashboard/users', middlewares.ensureAuth, middlewares.ensureAdmin, adminController.getUsers);
adminRouter.post('/dashboard/update-user-role', middlewares.ensureAuth, middlewares.ensureMaster, adminController.updateUserRole);
adminRouter.delete('/dashboard/delete-user/:userId', middlewares.ensureAuth, middlewares.ensureAdmin, adminController.deleteUser);

export { adminRouter };
import { Router } from "express";
import { AdminController } from "../controllers/adminController.js";

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.post('/create-role', adminController.createRole);

export { adminRouter };
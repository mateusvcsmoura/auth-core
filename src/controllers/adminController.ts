import { Handler } from "express";
import { HttpError } from "../errors/HttpError.js";
import { z } from "zod";
import { createRoleSchema } from "../schemas/authSchema.js";
import { AdminModel } from "../models/adminModel.js";

const adminModel = new AdminModel();

class AdminController {
    // POST /api/auth/admin/create-role
    createRole: Handler = async (req, res) => {
        if (!req.body) throw new HttpError(400, "No Body Req");

        try {
            const validatedData = createRoleSchema.parse(req.body);
            const newRole = await adminModel.createRole(validatedData.name, validatedData.description);

            if (!newRole) throw new HttpError(409, "Role already exists");

            return res.status(201).json(newRole);
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ message: "Invalid Role Attributes", errors: e.issues })
            }

            if (e instanceof HttpError) {
                return res.status(e.status).json({ message: e.message });
            }

            return res.status(500).json({ message: "Internal server errors" });
        }
    }
}

export { AdminController };


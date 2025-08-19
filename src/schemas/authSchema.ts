import { z } from "zod";

export const createRoleSchema = z.object({
    name: z.string().min(3, "Role name must have 3 characters"),
    description: z.string().optional()
});

export type TCreateRole = z.infer<typeof createRoleSchema>;

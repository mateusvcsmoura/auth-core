import { z } from "zod";

export const createRoleSchema = z.object({
    name: z.string().min(3, { error: "Role name must have 3 characters" }),
    description: z.string().optional()
});

export const registerUserSchema = z.object({
    name: z.string().min(4, "Username must have 4 characters"),
    email: z.email({ error: "E-mail format is not valid" }),
    password: z.string()
        .min(8, { error: "Password must have 8 characters" })
        .regex(/[a-z]/, { error: "Password must have at least one lowercase character" })
        .regex(/[A-Z]/, { error: "Password must have at least one uppercase character" })
        .regex(/[0-9]/, { error: "Password must have at least one number" }).
        regex(/[!@#$%^&*]/, { error: "Password must have at least one valid special character" })
});

export const loginUserSchema = z.object({
    email: z.email({ error: "E-mail format is not valid" }),
    password: z.string().min(8, { error: "Password must have 8 characters" })
});

export const changeUserPasswordSchema = z.object({
    oldPassword: z.string().min(8, { error: "Password must have 8 characters" }),
    newPassword: z.string()
        .min(8, { error: "Password must have 8 characters" })
        .regex(/[a-z]/, { error: "Password must have at least one lowercase character" })
        .regex(/[A-Z]/, { error: "Password must have at least one uppercase character" })
        .regex(/[0-9]/, { error: "Password must have at least one number" }).
        regex(/[!@#$%^&*]/, { error: "Password must have at least one valid special character" })
});

export type TCreateRole = z.infer<typeof createRoleSchema>;
export type TRegisterUser = z.infer<typeof registerUserSchema>;
export type TLoginUser = z.infer<typeof loginUserSchema>;
export type TChangeUserPassword = z.infer<typeof changeUserPasswordSchema>;

import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface UserRegister {
    name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface ChangeUserPassword {
    email: string;
    oldPassword: string;
    newPassword: string;
}

export interface CustomJwtPayload extends JwtPayload {
    id: number;
    email: string;
    name: string;
    roleName: string
}

export enum Staff {
    Admin,
    Master
}

export const publicUserSelect = {
    id: true,
    email: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    roleId: true,
    role: { select: { id: true, name: true } },
} as const;

export type UserRole = "Standard" | "Admin";
export type ProtectedRoles = "Standard" | "Admin" | "Master";
export type PublicUser = Prisma.UsersGetPayload<{ select: typeof publicUserSelect }>;
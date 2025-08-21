import { prisma } from "../database/index.js"
import { HttpError } from "../errors/HttpError.js";
import { UserRole } from "../interfaces/auth-interfaces.js";
export class AdminModel {
    createRole = async (roleName: string, roleDescription?: string) => {
        if (!roleName) return null;

        const existingRole = await this.getRoleByName(roleName);
        if (existingRole) throw new HttpError(409, "Role already exists");

        const newRole = await prisma.roles.create({
            data: { name: roleName, description: roleDescription }
        });

        if (!newRole) return null;

        return newRole;
    }

    getRoleByName = async (roleName: string) => {
        const existingRole = await prisma.roles.findUnique({
            where: { name: roleName },
        });

        return existingRole ? true : false;
    }

    getAllUsers = async () => {
        const users = await prisma.users.findMany({
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true, role: true }
        });

        return users;
    }

    updateRole = async (userId: number, newRole: UserRole) => {
        const user = await this.getMemberById(userId);
        if (!user) throw new HttpError(404, "User not found");
        if (user.role.name === "Master") throw new HttpError(401, "Cannot change Masters Users role");
        if (user.role.name === newRole) throw new HttpError(409, `User is already a ${newRole}`);

        const role = await prisma.roles.findUnique({
            where: { name: newRole }
        });

        if (!role) throw new HttpError(404, "Role not found");

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { roleId: role.id },
            select: { id: true, email: true, role: true, name: true, createdAt: true, updatedAt: true, roleId: true }
        });

        return updatedUser;
    }

    deleteMember = async () => { }

    getMemberById = async (userId: number) => {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { role: true }
        });

        return user;
    }
};


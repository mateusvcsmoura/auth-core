import { prisma } from "../database/index.js"

export class AdminModel {
    createRole = async (roleName: string, roleDescription?: string) => {
        if (!roleName) return null;

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
};


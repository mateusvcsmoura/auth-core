import { prisma } from "../database/index.js"
import { HttpError } from "../errors/HttpError.js";

export class AdminModel {
    createRole = async (roleName: string, roleDescription?: string) => {
        if (!roleName) return null;

        const existingRole = await prisma.roles.findUnique({
            where: { name: roleName },
        });

        if (existingRole) return null;

        const newRole = await prisma.roles.create({
            data: { name: roleName, description: roleDescription }
        });

        if (!newRole) return null;

        return newRole;
    }
};


import { Prisma } from "@prisma/client";
import { prisma } from "../database/index.js"
import { HttpError } from "../errors/HttpError.js";
import { PublicUser, publicUserSelect, UserRole } from "../interfaces/auth-interfaces.js";
import { isProtected, isStaffMember, normalizeRoleName } from "../modules/utils.js";
export class AdminModel {
    createRole = async (roleName: string, roleDescription?: string) => {
        if (!roleName) throw new HttpError(400, "Role name is required");

        try {
            const newRole = await prisma.roles.create({
                data: { name: normalizeRoleName(roleName), description: roleDescription }
            });

            return newRole;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    throw new HttpError(409, "Role already exists");
                }
            }

            throw e;
        }
    }

    getAllUsers = async (opts?: { take?: number, skip?: number, orderBy?: "createdAt" | "name" | "email", order?: "asc" | "desc" }): Promise<PublicUser[]> => {
        const { take = 50, skip = 0, orderBy = "createdAt", order = "desc" } = opts ?? {};
        const users = await prisma.users.findMany({
            take,
            skip,
            orderBy: { [orderBy]: order },
            select: publicUserSelect
        });

        return users;
    }

    updateRole = async (userId: number, newRole: UserRole) => {
        const user = await this.getMemberById(userId);
        if (!user) throw new HttpError(404, "User not found");

        if (user.role.name === "Master") throw new HttpError(403, "Cannot change Masters Users role");
        if (user.role.name === newRole) throw new HttpError(409, `User is already a ${newRole}`);

        try {
            const updatedUser = await prisma.users.update({
                where: { id: userId },
                data: { role: { connect: { name: newRole } } }, // check role
                select: { id: true, email: true, role: true, name: true, createdAt: true, updatedAt: true, roleId: true }
            });

            return updatedUser;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new HttpError(404, "Role not found");
                }
            }

            throw e;
        }
    }

    deleteMember = async (userId: number) => {
        const user = await this.getMemberById(userId);
        if (!user) throw new HttpError(404, "User not found");

        if (isStaffMember(user.role.name)) throw new HttpError(403, "Cannot delete a staff member. Demote first.");

        try {
            const deletedUser = await prisma.users.delete({
                where: { id: userId },
                select: publicUserSelect
            });

            return deletedUser;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new HttpError(404, "User not found");
                }
            }

            throw e;
        }
    }

    deleteRole = async (roleId: number) => {
        if (!roleId) throw new HttpError(400, "Role ID is required");

        try {
            const role = await prisma.roles.findUnique({
                where: { id: roleId }
            });

            if (!role) throw new HttpError(404, "Role not found");
            if (isProtected(role.name)) throw new HttpError(403, "Cannot delete protected roles");

            const deletedRole = await prisma.roles.delete({
                where: { id: roleId },
            });

            return deletedRole;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new HttpError(404, "Role not found");
                }

                if (e.code === "P2003") {
                    throw new HttpError(409, "Cannot delete a role that has users linked to it");
                }
            }

            throw e;
        }
    };

    getMemberById = async (userId: number) => {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: publicUserSelect
        });

        return user;
    }
};


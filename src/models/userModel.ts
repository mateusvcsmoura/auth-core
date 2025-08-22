import { publicUserSelect } from './../interfaces/auth-interfaces.js';
import { prisma } from "../database/index.js";
import { ChangeUserPassword, CustomJwtPayload, UserLogin, UserRegister } from "../interfaces/auth-interfaces.js";
import { HttpError } from '../errors/HttpError.js';
import { JWT_SECRET } from '../config/index.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

class UserModel {
    private getUserForAuthByEmail = async (rawEmail: string) => { // method to return all user info (including password) for auth
        const email = normalizeEmail(rawEmail);
        const user = prisma.users.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: { select: { id: true, name: true } },
            },
        });

        return user;
    }

    register = async (user: UserRegister) => {
        if (!user) return null;

        try {
            const newUser = await prisma.users.create({
                data: {
                    email: normalizeEmail(user.email),
                    name: user.name,
                    password: bcrypt.hashSync(user.password, 10),
                    roleId: 5 // standard user
                },
                select: publicUserSelect
            });

            return newUser;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") { // prisma error code (unique violation)
                    throw new HttpError(409, "E-mail already in use");
                }
            }

            throw new HttpError(500, "Could not create user");
        }
    }

    login = async (userData: UserLogin) => {
        const user = await this.getUserForAuthByEmail(userData.email);
        if (!user) throw new HttpError(404, "User not found");

        const passwordMatch = bcrypt.compareSync(userData.password, user.password);
        if (!passwordMatch) throw new HttpError(401, "Invalid E-mail or Password");

        const payload = { id: user.id, email: user.email, name: user.name, role: user.role.name };
        const secret = JWT_SECRET;

        const token = jwt.sign(payload, secret, {
            expiresIn: '1h',
            subject: 'Auth Core | User Login'
        });

        return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role.name } };
    }

    changePassword = async (userInfo: ChangeUserPassword) => {
        const user = await this.getUserForAuthByEmail(userInfo.email);
        if (!user) throw new HttpError(404, "User not found");

        const passwordMatch = bcrypt.compareSync(userInfo.oldPassword, user.password);
        if (!passwordMatch) throw new HttpError(400, "Incorrect Password");
        if (userInfo.newPassword === userInfo.oldPassword) throw new HttpError(400, "New password must be different from old password");

        const hashedNewPassword = bcrypt.hashSync(userInfo.newPassword, 10);

        const updatedUser = await prisma.users.update({
            data: { password: hashedNewPassword }, // save hashed password in database
            where: { id: user.id },
            select: publicUserSelect
        });

        return updatedUser;
    }

    deleteAccount = async (userPayload: CustomJwtPayload) => {
        try {
            const deletedUser = await prisma.users.delete({
                where: { id: userPayload.id },
                select: publicUserSelect
            });

            return deletedUser;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') { // error code from prisma
                    throw new HttpError(404, "User not found");
                }
            }

            throw new HttpError(500, "Could not delete user");
        }
    }

    getUserByEmail = async (rawEmail: string) => { // public does not return password
        const email = normalizeEmail(rawEmail);
        const user = await prisma.users.findUnique({
            where: { email: email },
            select: publicUserSelect
        });

        return user;
    }

    getUserById = async (id: number) => { // public does not return password
        const user = await prisma.users.findUnique({
            where: { id: id },
            select: publicUserSelect
        });

        return user;
    }

    getUserAsPayload = async (userId: number): Promise<CustomJwtPayload> => { // ../middlewares/auth-middlewares
        const user = await this.getUserById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const { name, email, id, role: { name: roleName } } = user;
        const userPayload = { name, email, id, roleName };

        return userPayload;
    }
};

export { UserModel };

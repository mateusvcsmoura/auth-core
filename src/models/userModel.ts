import { prisma } from "../database/index.js";
import { ChangeUserPassword, CustomJwtPayload, UserLogin, UserRegister } from "../interfaces/auth-interfaces.js";
import { HttpError } from '../errors/HttpError.js';
import { JWT_SECRET } from '../config/index.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserModel {
    register = async (user: UserRegister) => {
        if (!user) return null;

        const existingUser = await this.getUserByEmail(user.email);
        if (existingUser) throw new HttpError(409, "E-mail already in use");

        const newUser = await prisma.users.create({
            data: {
                email: user.email,
                name: user.name,
                password: bcrypt.hashSync(user.password, 10),
                roleId: 5 // standard user
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                roleId: true,
            }
        });

        if (!newUser) return null;

        return newUser;
    }

    login = async (userData: UserLogin) => {
        const user = await this.getUserByEmail(userData.email);
        if (!user) throw new HttpError(404, "User not found");

        const passwordMatch = bcrypt.compareSync(userData.password, user.password);
        if (!passwordMatch) throw new HttpError(400, "Invalid Credentials");

        const payload = { id: user.id, email: user.email, name: user.name, role: user.role.name };
        const secret = JWT_SECRET;

        const token = jwt.sign(payload, secret, {
            expiresIn: '1h',
            subject: 'user login'
        });

        return token;
    }

    changePassword = async (userInfo: ChangeUserPassword) => {
        const user = await this.getUserById(userInfo.id);
        if (!user) throw new HttpError(404, "User not found");

        const passwordMatch = bcrypt.compareSync(userInfo.oldPassword, user.password);
        if (!passwordMatch) throw new HttpError(400, "Incorrect Password");

        const hashedNewPassword = bcrypt.hashSync(userInfo.newPassword, 10);

        const updatedUser = await prisma.users.update({
            data: { password: hashedNewPassword }, // save hashed password in database
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                roleId: true,
            }
        });

        return updatedUser;
    }

    getUserByEmail = async (email: string) => {
        const user = await prisma.users.findUnique({
            where: { email: email },
            include: { role: true }
        });

        return user;
    }

    getUserById = async (id: number) => {
        const user = await prisma.users.findUnique({
            where: { id: id },
            include: { role: true }
        });

        return user;
    }

    getUserAsPayload = async (userId: number): Promise<CustomJwtPayload> => {
        const user = await this.getUserById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const { name, email, id, role: { name: roleName } } = user;
        const userPayload = { name, email, id, roleName };

        return userPayload;
    }
};

export { UserModel };

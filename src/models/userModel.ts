import * as bcrypt from 'bcrypt';
import { prisma } from "../database/index.js";
import { UserLogin, UserRegister } from "../interfaces/auth-interfaces.js";
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

class UserModel {
    register = async (user: UserRegister) => {
        if (!user) return null;

        const newUser = await prisma.users.create({
            data: {
                email: user.email,
                name: user.name,
                password: bcrypt.hashSync(user.password, 10),
                roleId: 5 // standard user
            }
        });

        if (!newUser) return null;

        return newUser;
    }

    login = async (userData: UserLogin) => {
        const user = await this.getUserByEmail(userData.email);
        if (!user) return { success: false, reason: "USER_NOT_FOUND" };

        const passwordMatch = bcrypt.compareSync(userData.password, user.password)
        if (!passwordMatch) return { success: false, reason: "INVALID_PASSWORD" };

        const payload = { id: user.id, email: user.email, name: user.name, role: user.role.name };
        const secret = process.env.JWT_SECRET!;
        if (!secret) throw new Error("JWT_SECRET is not defined");

        const token = jwt.sign(payload, secret, {
            expiresIn: '1h',
            subject: 'user login'
        });

        return { success: true, token };
    }

    getUserByEmail = async (email: string) => {
        const user = await prisma.users.findUnique({
            where: { email: email },
            include: { role: true }
        });

        return user;
    }

    userExists = async (email: string) => {
        const userExists = await this.getUserByEmail(email);

        return !!userExists;
    }
};

export { UserModel };
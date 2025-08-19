import * as bcrypt from 'bcrypt';
import { prisma } from "../database/index.js";
import { UserRegister } from "../interfaces/auth-interfaces.js";

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

    getUserByEmail = async (email: string) => {
        const existingEmail = await prisma.users.findUnique({
            where: { email: email }
        });

        return existingEmail ? true : false;
    }
};

export { UserModel };
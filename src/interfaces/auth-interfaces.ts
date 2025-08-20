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
    id: number;
    oldPassword: string;
    newPassword: string;
}

export interface CustomJwtPayload extends JwtPayload {
    id: number;
    email: string;
    name: string;
    roleName: string
}


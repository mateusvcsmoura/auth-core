import { ProtectedRoles, Staff } from "../interfaces/auth-interfaces.js";
import * as bcrypt from 'bcrypt';

const STAFF_SET = new Set<string>(Object.values(Staff) as string[]);

export function isProtected(role: string): role is ProtectedRoles {
    return role === "Standard" || role === "Admin" || role === "Master";
}

export function normalizeEmail(rawEmail: string) {
    return rawEmail.trim().toLocaleLowerCase();
}

export function normalizeRoleName(rawRoleName: string) {
    return rawRoleName.trim();
}

export function isStaffMember(userRole: string) {
    return STAFF_SET.has(userRole);
}

export function hash(value: string, rounds: number = 10) {
    return bcrypt.hashSync(value, rounds);
}

export function compareHash(value: string, valueToCompare: string) {
    return bcrypt.compareSync(value, valueToCompare);
}


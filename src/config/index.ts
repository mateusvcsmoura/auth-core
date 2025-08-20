import { config } from 'dotenv';
import { env } from 'process';

config();

const JWT_SECRET = env.JWT_SECRET!;
const PORT = env.PORT || 3000;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export {
    JWT_SECRET,
    PORT
};


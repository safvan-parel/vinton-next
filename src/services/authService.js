import bcrypt from "bcrypt";
import { userRepository } from "@/repositories/userRepository";
import {
    generateToken,
    getCookieMaxAge,
    getTokenExpiresIn,
} from "@/lib/auth/jwt";

export const authService = {
    async login(email, password, { rememberMe = false } = {}) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error("Invalid email or password");
        }

        const expiresIn = getTokenExpiresIn(rememberMe);
        const token = generateToken(user, { expiresIn });

        return {
            token,
            rememberMe,
            maxAge: getCookieMaxAge(rememberMe),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    },

    async logout() {
        return { message: "Logged out successfully" };
    },
};

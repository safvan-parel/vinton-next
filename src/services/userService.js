import { userRepository } from "@/repositories/userRepository";

export const userService = {
    async createUser(data) {
        const existing = await userRepository.findByEmail(data.email);

        if (existing) {
            throw new Error("User already registered");
        }

        const user = await userRepository.create(data);

        return user;
    },

    async getUserById(id) {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    },

    async updateProfile(id, data) {
        const existing = await userRepository.findByEmail(data.email);

        if (existing && existing.id !== id) {
            throw new Error("Email already in use");
        }

        const payload = {
            name: data.name,
            email: data.email,
        };

        if (data.password) {
            payload.password = data.password;
        }

        return userRepository.update(id, payload);
    },
};
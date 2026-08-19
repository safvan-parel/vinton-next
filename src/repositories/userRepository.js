import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const userSelect = {
    id: true,
    name: true,
    email: true,
    createdAt: true,
};

export const userRepository = {
    findByEmail: async (email) => {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    findById: async (id) => {
        return prisma.user.findUnique({
            where: { id },
            select: userSelect
        });
    },

    create: async (data) => {
        if (data.password) data.password = await bcrypt.hash(data.password, 10);

        return prisma.user.create({
            data,
            select: userSelect
        });
    },

    update: async (id, data) => {
        if (data.password) data.password = await bcrypt.hash(data.password, 10);

        return prisma.user.update({
            where: { id },
            data,
            select: userSelect
        });
    },

    delete: async (id) => {
        return prisma.user.delete({
            where: { id },
        });
    },
};
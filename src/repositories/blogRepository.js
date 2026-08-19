import { prisma } from "@/lib/prisma";

export const blogSelect = {
    id: true,
    title: true,
    primaryImage: true,
    desc1: true,
    images: true,
    desc2: true,
    active: true,
    createdById: true,
    createdAt: true,
    updatedAt: true,
    createdBy: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

export const blogRepository = {
    findAll: async () => {
        return prisma.blog.findMany({
            select: blogSelect,
            orderBy: { id: "desc" },
        });
    },

    findById: async (id) => {
        return prisma.blog.findUnique({
            where: { id },
            select: blogSelect,
        });
    },

    create: async (data) => {
        return prisma.blog.create({
            data,
            select: blogSelect,
        });
    },

    update: async (id, data) => {
        return prisma.blog.update({
            where: { id },
            data,
            select: blogSelect,
        });
    },

    delete: async (id) => {
        return prisma.blog.delete({
            where: { id },
            select: blogSelect,
        });
    },
};

import { prisma } from "@/lib/prisma";

export const sliderSelect = {
    id: true,
    title: true,
    image: true,
    desc: true,
    active: true,
    createdAt: true,
    updatedAt: true,
};

export const sliderRepository = {
    findAll: async () => {
        return prisma.slider.findMany({
            select: sliderSelect,
            orderBy: { id: "desc" },
        });
    },

    findById: async (id) => {
        return prisma.slider.findUnique({
            where: { id },
            select: sliderSelect,
        });
    },

    create: async (data) => {
        return prisma.slider.create({
            data,
            select: sliderSelect,
        });
    },

    update: async (id, data) => {
        return prisma.slider.update({
            where: { id },
            data,
            select: sliderSelect,
        });
    },

    delete: async (id) => {
        return prisma.slider.delete({
            where: { id },
            select: sliderSelect,
        });
    },
};

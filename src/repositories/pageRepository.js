import { prisma } from "@/lib/prisma";

export const pageSelect = {
    id: true,
    slug: true,
    title: true,
    type: true,
    status: true,
    draftContent: true,
    publishedContent: true,
    publishedAt: true,
    active: true,
    createdAt: true,
    updatedAt: true,
};

export const pageRepository = {
    findAll: async () => {
        return prisma.page.findMany({
            select: pageSelect,
            orderBy: { title: "asc" },
        });
    },

    findBySlug: async (slug) => {
        return prisma.page.findUnique({
            where: { slug },
            select: pageSelect,
        });
    },

    create: async (data) => {
        return prisma.page.create({
            data,
            select: pageSelect,
        });
    },

    update: async (slug, data) => {
        return prisma.page.update({
            where: { slug },
            data,
            select: pageSelect,
        });
    },
};

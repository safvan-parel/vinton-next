import { PrismaClient } from "@prisma/client";
import { applyAppTimezone } from "@/lib/timezone";

applyAppTimezone();

const globalForPrisma = globalThis;
const PRISMA_CLIENT_VERSION = "page-active-1";

function createPrisma() {
    return new PrismaClient({
        log: ["query", "error", "warn"],
    });
}

function getPrisma() {
    const current = globalForPrisma.prisma;
    const currentVersion = globalForPrisma.prismaClientVersion;

    if (current && currentVersion === PRISMA_CLIENT_VERSION && typeof current.page?.findMany === "function") {
        return current;
    }

    if (current) {
        current.$disconnect().catch(() => {});
    }

    const prisma = createPrisma();

    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prisma;
        globalForPrisma.prismaClientVersion = PRISMA_CLIENT_VERSION;
    }

    return prisma;
}

export const prisma = getPrisma();

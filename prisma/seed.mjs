import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const users = [
    {
        name: "Developer",
        email: "dev@parel.com",
        password: "dev@parel#!",
    },
    {
        name: "Vinton",
        email: "admin@vinton.com",
        password: "vinton@#!",
    },
];

async function main() {
    for (const user of users) {
        const password = await bcrypt.hash(user.password, 10);

        await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, password },
            create: {
                name: user.name,
                email: user.email,
                password,
            },
        });
    }

    console.log("Seeded 2 users");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

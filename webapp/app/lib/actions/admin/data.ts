import { PrismaClient } from "@prisma/client";
import { admin } from "@prisma/client";

const prisma = new PrismaClient();

export async function loginAdmin(username: string, password: string) {
    const admin = await prisma.admin.findUnique({
    where: {
      username: username,
      password: password,
    },
    });
    return admin;
}

import { PrismaClient } from "@prisma/client";
import { admin } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function loginAdmin(username: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username: username },
    });
    if (!admin) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return null;
    }

    

    return admin;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

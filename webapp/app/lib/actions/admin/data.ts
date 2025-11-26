import { PrismaClient } from "@prisma/client";
import { admin as Admin } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchAdminByMail(email: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: email },
    });
    if (admin && admin.email) {
      return null;
    }
    return admin as Admin;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

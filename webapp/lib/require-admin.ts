import "server-only";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !await prisma.admin.findUnique({ where: { email } })) {
    throw new Error("Unauthorized");
  }
}

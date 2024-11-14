import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function fetchRuns() {
    const runs = await prisma.run.findMany();
    return runs
}
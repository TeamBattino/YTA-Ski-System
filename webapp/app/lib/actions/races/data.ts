import { PrismaClient } from '@prisma/client';
import { race } from '@prisma/client';

const prisma = new PrismaClient();


export async function fetchRaces() {
  const races = await prisma.race.findMany();
  return races;
}
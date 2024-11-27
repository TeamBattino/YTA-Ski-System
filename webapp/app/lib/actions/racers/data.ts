import { PrismaClient } from '@prisma/client';
import { racer } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchRacerById(racer_id: string) {
  const racer = await prisma.racer.findUnique({
    where: { racer_id },
  });

  if (!racer) {
    throw new Error(`Racer with ID ${racer_id} not found.`);
  }

  return racer;
}

export async function fetchRacers() {
  const racers = await prisma.racer.findMany();
  return racers;
}

export async function createRacer(racer: racer) {
  const newRacer = await prisma.racer.create({ data: racer });
  return newRacer;
}

// Fetch recent runs for a given racer
export async function bruh(racer: racer) {
  const recentRuns = await prisma.run.findMany({
    where: { racer_id: racer.racer_id },
    select: {
      duration: true,
    },
    orderBy: { start_time: 'desc' },
  });

  return recentRuns;
}
